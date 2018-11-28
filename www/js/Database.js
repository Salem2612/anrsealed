console.log('Database.js loaded');

/**
  * Class Database
  *
  * Manage the Database.
  */
function Database(databaseJSON) {

  // CONSTRUCTOR
  this.mCycles = new Cycles(databaseJSON.cycles);
  this.mSets = new Sets(databaseJSON.sets, this.mCycles);
  this.mCards = new Cards(databaseJSON.cards, this.mSets);
}//end Database

Database.prototype = {

  /**
    * Return an Array of Card of the specified Set
    *
    * return  Cards
    */
  cloneCards : function(side, cycleNo, setNo, type, isShared, nbSets) {
    // Clone the Cards of the Database to not modify the Database
    var clonedCards = this.mCards.clone();
    // Create an empty pool of Cards
    var cards = new Cards([], this.mSets);
    // Put all Cards with the specified Cycle No and Set No and Side
    cards.mItems = clonedCards.mItems.filter(function(card) {
      // Number of available real copies
      card.mNbAvailableCopies = nbSets * card.mNbOfficialCopies;
      // Maximum number of copies per player
      //  ! Share and ANRSealed : Boost to the maximum available number of copies
      card.mNbMaxCopiesPerPlayer =  (isShared && (type == CardPool.TYPE_ANRSEALED) && (card.mNbCopiesANRSealed > 0)) ? card.mNbAvailableCopies :
                                    (type == CardPool.TYPE_ANRSEALED) ? card.mNbCopiesANRSealed :
                                    (type == CardPool.TYPE_STIMHACK) ? card.mNbCopiesStimhack :
                                    card.mNbAvailableCopies;
      // Limit the maximum number of copies per player to 3
      card.mNbMaxCopiesPerPlayer = Math.min(card.mNbMaxCopiesPerPlayer, card.mNbMaxCopiesPerDeck);
      // Current number of available copies for one player
      card.mNbCopies = Math.min(card.mNbMaxCopiesPerPlayer, card.mNbAvailableCopies);
      // The Cycle No, Set No and Side must match and the Card must have a number of copies greater than 0
      return ((card.mCycleNo == cycleNo) && (card.mSetNo == setNo) && (card.mSide == side) && (card.mNbCopies > 0));
    });
    return cards;
  }

};
