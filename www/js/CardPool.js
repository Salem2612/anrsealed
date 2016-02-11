console.log('CardPool.js loaded');

/**
  * Class CardPool
  *
  * Pool of Cards and the Constraints to create the Packs
  */
function CardPool(side, nbPacks, nbCardCopies, cardPoolJSON, database) {

  // CONSTRUCTOR
  // Initialize members
	this.mName              = cardPoolJSON.type[0].toUpperCase() + cardPoolJSON.type.substr(1).toLowerCase() + " - " + cardPoolJSON.edition[0].toUpperCase() + cardPoolJSON.edition.substr(1).toLowerCase();  // Name of the CardPool
	this.mType              = cardPoolJSON.type;          // Type of the CardPool (See CardPool.TYPE)
	this.mEdition           = cardPoolJSON.edition;       // Edition of the CardPool
	this.mSide              = side;                       // Side of the CardPool
  this.mNbPacks           = nbPacks;                    // Number of Copies of the Packs
  this.mImagePath         = cardPoolJSON.imagePath;     // Image of the CardPool
  this.mCycleIds          = cardPoolJSON.cycleIds;      // IDs of the cycles of the CardPool
  this.mNbCardCopies      = nbCardCopies;               // Number of Copies of each Card in the CardPool
  this.mConstraints       = new Constraints(cardPoolJSON.sidesConstraints[this.mSide]); // Constraints to generate Packs from the CardPool
  this.mCards             = new Cards([]);              // Cards in the CardPool
  this.mCardPoolJSON      = cardPoolJSON;
  this.mDatabase          = database;

  // Add the Cards in the CardPool
  for (var iCycle = 0; iCycle < this.mCycleIds.length; iCycle++) {
    // Retrieve the Cards of the current Cycle from the database
    var cards = database.cloneCards(this.mCycleIds[iCycle], this.mSide);
    // Add the Cards in the CardPool
    for (var iCard = 0; iCard < cards.mItems.length; iCard++) {
      var card = cards.mItems[iCard];
      // Set the number of copies of the card
      card.mNbCopies = this.mNbCardCopies;
      // Add the current Card
      this.mCards.add(card);
    }
  }

}

CardPool.prototype = {

  clone : function() {
    var clone = new CardPool(this.mSide, this.mNbPacks, this.mNbCardCopies, this.mCardPoolJSON, this.mDatabase);
    return clone;
  }

};

/**
  * Enum TYPE
  */
CardPool.TYPE = {
  STARTER:'STARTER',
  BOOSTER:'BOOSTER'
};
