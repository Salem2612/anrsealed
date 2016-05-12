console.log('Card.js loaded');

/**
  * Class Card
  *
  * Definition of a Card
  */
function Card(cardJSON) {

  // CONSTRUCTOR
	this.mId              = cardJSON.id;
	this.mCycleNo         = cardJSON.cycleNo;
	this.mSetNo           = cardJSON.setNo;
	this.mCardNo          = cardJSON.cardNo;
	this.mNameEn          = cardJSON.nameEn;
	this.mNameFr          = cardJSON.nameFr;
  this.mSide            = cardJSON.side;
  this.mTypes           = cardJSON.types;
	this.mNbCopies        = cardJSON.nbCopies;
	this.mNbOffialCopies  = cardJSON.nbOfficialCopies;
	this.mScore           = 0;

}//end Card

Card.prototype = {

  clone : function() {
    var clone = new Card({
      'id':this.mId,
      'cycleNo':this.mCycleNo,
      'setNo':this.mSetNo,
      'cardNo':this.mCardNo,
      'nameEn':this.mNameEn,
      'nameFr':this.mNameFr,
      'side':this.mSide,
      'types':this.mTypes,
      'nbCopies':this.mNbCopies,
      'nbOfficialCopies':this.mNbOffialCopies
    });
    clone.mScore = this.mScore;
    return clone;
  },

  /**
    * Check if the Card has the specified Type
    */
  hasType : function(type) {
    var hasType = false;
    for (var cardType of this.mTypes) {
      if (cardType == type) {
        hasType = true;
        break; // Stop searching
      }
    }
    return hasType;
  },

  /**
    * Get the rarity of the Card
    */
  getRarity : function() {
    for (var cardType of this.mTypes) {
      switch (cardType) {
        case CardType.FIXED : return CardType.FIXED;
        case CardType.COMMON : return CardType.COMMON;
        case CardType.UNCO : return CardType.UNCO;
        case CardType.RARE : return CardType.RARE;
        case CardType.BANNED : return CardType.BANNED;
      }
    }
  },

  /**
    * Get the types of the card as text. The types are delimited by commas.
    */
  getTextTypes : function() {
    var text = "";
    for (var iType = 0; iType < this.mTypes.length; iType++) {
      text += this.mTypes[iType];
      // Add a space after each Type, but not for the last Type
      if (iType != this.mTypes.length-1) {
        text += ", ";
      }
    }
    return text;
  },

  /**
    * Get the name of the Card
    */
  getName : function(locale) {
    var name = this.mNameEn;  // Default name is in English

    // French Name
    if (("FR" == locale) && ("" != this.mNameFr)) {
      name = this.mNameFr;
    }

    return name;
  },

  /**
    * Get the URL of the Card on NetrunnerDB
    */
  getURL : function() {
    var url = "http://netrunnerdb.com/en/card/" + this.mId;
    return url;
  },

  /**
    * Get the URL of the Card on NetrunnerDB
    */
  getText : function(locale) {
    var text = this.mNbCopies + "x " + this.getName(locale) + "\r\n";
    return text;
  },

  /**
    * Get the URL of the Card on NetrunnerDB
    */
  getTextWithRarity : function(locale) {
    var text = this.mNbCopies + "x " + this.getName(locale) + " (" + this.getRarity() + ")" + "\r\n";
    return text;
  },

  /**
    * Calculate the Score of the Card with the specified Constraint
    */
  calculateScore : function(constraints) {
    // Reinitialize the score of the Card
    this.mScore = 0;
    // Check if the Card is available
    if (this.mNbCopies > 0) {
      // Add the Number of Copies to the score to give more priority to the Cards that are not picked
      // this.mScore += (30 * this.mNbCopies);  TODO 1_CARD_COPY
      // Calculate the score of the cards with each constraint
      for (var iConstraint = 0; iConstraint < constraints.mItems.length; iConstraint++) {
        // Try to meet the current constraint
        var score = constraints.mItems[iConstraint].tryMeet(this);
        // Check if the Card meet an already complete Constraint
        if (score == -1) {
          // The Card meet an already complete Constraint
          // The Card must not be picked : Set its Score to 0
          this.mScore = 0;
          break;  // Stop calculating the score of the Card
        }
        else {
          // The Card does not meet an already complete Constraint
          // Accumulate the score of the Card with the score of the Constraint
          this.mScore += score;
        }
      }
    }
    return this.mScore;
  }

};
