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
    * Return an Array of Card with the specified Cycle ID
    *
    * return  Cards
    */
  cloneCards : function(cycleId, side) {
    // Clone the Cards of the Database to not modify the Database
    var clonedCards = this.mCards.clone();
    // Create an empty pool of Cards
    var cards = new Cards([]);
    // Put all Cards with the specified Cycle ID and Side
    cards.mItems = clonedCards.mItems.filter(function(card) {
      // The Cycle ID and Side must match and the Card must have a number of copies greater than 0
      return ((card.mCycleNo == cycleId) && (card.mSide == side) && (card.mNbCopies > 0)); // CycleId == CycleNo
    });
    return cards;
  }

};
