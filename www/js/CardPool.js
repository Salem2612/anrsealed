console.log('CardPool.js loaded');

/**
  * Class CardPool
  *
  * Pool of Cards and the Constraints to create the Packs
  */
function CardPool(side, sets, type, isShared, starterConstraints, boosterConstraints, database) {

  // CONSTRUCTOR
  // Initialize members
	this.mSide                    = side; // Side of the CardPool
  this.mType                    = type; // See CardPool.TYPE_*
  this.mIsShared                = isShared; // true : the CardPool is shared. false : On CardPool per player.
  this.mSets                    = sets; // array of {"cycleNo" : X, "setNo" : X, "nbSets" : X}
  this.mStarterConstraints      = starterConstraints; // Constraints to generate the Starter from the CardPool
  this.mStarterConstraintsSaved = starterConstraints.clone(); // Constraints to generate the Starter from the CardPool
  this.mBoosterConstraints      = boosterConstraints; // Constraints to generate the Boosters from the CardPool
  this.mBoosterConstraintsSaved = boosterConstraints.clone(); // Constraints to generate the Boosters from the CardPool
  this.mDatabase                = database;
  this.mCards                   = new Cards([], this.mDatabase.mSets);  // Cards in the CardPool

  // Add the Cards of the Sets in the CardPool
  for (var iSet = 0; iSet < this.mSets.length; iSet++) {
    var set = this.mSets[iSet];
    if(set.nbSets > 0)
    {
      // Retrieve the Cards of the current Set from the database
      var cards = this.mDatabase.cloneCards(this.mSide, set.cycleNo, set.setNo, this.mType, this.mIsShared, set.nbSets);
      // Add the Cards in the CardPool
      Array.prototype.push.apply(this.mCards.mItems, cards.mItems);
    }
  }

}

CardPool.prototype = {

  clone : function() {
    var clone = new CardPool(this.mSide, this.mSets, this.mType, this.mIsShared, this.mStarterConstraintsSaved, this.mBoosterConstraintsSaved, this.mDatabase);
    return clone;
  },

  fill : function() {
    for (var card of this.mCards.mItems)
    {
      // Fill the number of copies of the card
      card.mNbCopies = Math.min(card.mNbMaxCopiesPerPlayer, card.mNbAvailableCopies);
    }
    return this;
  }

};

// Enum CardPool Type
CardPool.TYPE_ANRSEALED = "anrsealed";
CardPool.TYPE_STIMHACK  = "Stimhack";
CardPool.TYPE_ALL_CARDS = "All cards";
