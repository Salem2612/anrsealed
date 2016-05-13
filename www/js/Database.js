console.log('Database.js loaded');

/**
  * Class Database
  *
  * Manage the Database.
  */
function Database(databaseJSON) {

  // CONSTRUCTOR
  this.mCards = new Cards(databaseJSON.cards);
}//end Database

Database.prototype = {

  /**
    * Return an Array of Card of the specified Set
    *
    * return  Cards
    */
  cloneCards : function(side, cycleNo, setNo, useAllCards, nbSets) {
    // Clone the Cards of the Database to not modify the Database
    var clonedCards = this.mCards.clone();
    // Create an empty pool of Cards
    var cards = new Cards([]);
    // Put all Cards with the specified Cycle No and Set No and Side
    cards.mItems = clonedCards.mItems.filter(function(card) {
      // Check if use the official or specified number of copies, according to the number of available copies
      var nbAvailableCopies = nbSets * card.mNbOffialCopies;
      card.mNbCopies = useAllCards ? nbAvailableCopies : Math.min(card.mNbCopies, nbAvailableCopies);
      // The Cycle No, Set No and Side must match and the Card must have a number of copies greater than 0
      return ((card.mCycleNo == cycleNo) && (card.mSetNo == setNo) && (card.mSide == side) && (card.mNbCopies > 0));
    });
    return cards;
  }

};
