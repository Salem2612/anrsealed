console.log('Card.js loaded');

/**
  * Class Card
  *
  * Definition of a Card
  */
function Card(cardJSON, set) {

  // CONSTRUCTOR
	this.mId                    = cardJSON.id;
	this.mCycleNo               = cardJSON.cycleNo;
	this.mSetNo                 = cardJSON.setNo;
  this.mSet                   = set;
	this.mCardNo                = cardJSON.cardNo;
	this.mNameEn                = cardJSON.nameEn;
	this.mNameFr                = cardJSON.nameFr;
  this.mSide                  = cardJSON.side;
  this.mFaction               = cardJSON.faction;
  this.mTypes                 = cardJSON.types;
	this.mNbOfficialCopies      = cardJSON.nbOfficialCopies;
	this.mNbCopiesANRSealed     = cardJSON.nbCopiesANRSealed;
	this.mNbCopiesStimhack      = cardJSON.nbCopiesStimhack;
	this.mNbAvailableCopies     = 0;
	this.mNbMaxCopiesPerPlayer  = 0;
	this.mNbCopies              = 0;

}//end Card

Card.prototype = {

  clone : function() {
    var clone = new Card(
      {
        'id':this.mId,
        'cycleNo':this.mCycleNo,
        'setNo':this.mSetNo,
        'cardNo':this.mCardNo,
        'nameEn':this.mNameEn,
        'nameFr':this.mNameFr,
        'side':this.mSide,
        'faction':this.mFaction,
        'types':this.mTypes,
        'nbOfficialCopies':this.mNbOfficialCopies,
        'nbCopiesANRSealed':this.mNbCopiesANRSealed,
        'nbCopiesStimhack':this.mNbCopiesStimhack
      },
      this.mSet);
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
    * Find the Type of the Card among the specified Type
    */
  findType : function(types) {
    var foundType = "";
    for (var type of types) {
      if (this.hasType(type)) {
        foundType = type;
        break; // Stop searching
      }
    }
    return foundType;
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
      text += "[" + this.mTypes[iType] + "]";
      // Add a space after each Type, but not for the last Type
      if (iType != this.mTypes.length-1) {
        text += " ";
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
    * Get the text of the Card
    */
  getText : function(locale) {
    var text = this.mNbCopies + "x " + this.getName(locale) + "\r\n";
    return text;
  },

  /**
    * Get the full text of the Card
    */
  getFullText : function(locale) {
    var text = this.mNbCopies + "x " + this.getName(locale) + " (" + this.mSet.getCycleAndSetNames(locale) + ", " + this.mFaction + ") " + this.getTextTypes() + "\r\n";
    return text;
  }

};
