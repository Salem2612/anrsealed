console.log('CardPool.js loaded');

/**
  * Class CardPool
  *
  * Pool of Cards and the Constraints to create the Packs
  */
function CardPool(side, sets, useAllCards, constraintsJSON, database) {

  // CONSTRUCTOR
  // Initialize members
	this.mSide                = side; // Side of the CardPool
  this.mUseAllCards         = useAllCards;  // true : Use nbOfficialCopies. false : use nbCopies.
  this.mSets                = sets; // array of {"cycleNo" : X, "setNo" : X, "nbSets" : X}
  this.mConstraints         = new Constraints(constraintsJSON[this.mSide]); // Constraints to generate Packs from the CardPool
  this.mConstraintsJSON     = constraintsJSON;
  this.mDatabase            = database;
  this.mCards               = new Cards([], this.mDatabase.mSets);  // Cards in the CardPool

  // Add the Cards of the Sets in the CardPool
  for (var iSet = 0; iSet < this.mSets.length; iSet++) {
    var set = this.mSets[iSet];
    if(set.nbSets > 0)
    {
      // Retrieve the Cards of the current Set from the database
      var cards = this.mDatabase.cloneCards(this.mSide, set.cycleNo, set.setNo, this.mUseAllCards, set.nbSets);
      // Add the Cards in the CardPool
      Array.prototype.push.apply(this.mCards.mItems, cards.mItems);
    }
  }

}

CardPool.prototype = {

  clone : function() {
    var clone = new CardPool(this.mSide, this.mSets, this.mUseAllCards, this.mConstraintsJSON, this.mDatabase);
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
