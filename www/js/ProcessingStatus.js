console.log('ProcessingStatus.js loaded');

/**
  * Class ProcessingStatus
  *
  * Status of a processing.
  */
function ProcessingStatus() {

  // CONSTRUCTOR
  this.mValue = ProcessingStatus.NOT_DONE;
  this.mDetail = ProcessingStatus.DETAIL.NOT_ENOUGH_CARDS;

}//end ProcessingStatus

ProcessingStatus.prototype = {

  /**
    *
    *
    * return  Enum ProcessingStatus
    */
  process : function(newValue) {
    // Select the new value from its old value and the new value
    if (ProcessingStatus.NOT_DONE == this.mValue) {
      // Anything erases NOT_DONE
      this.mValue = newValue;
    }
    else if (ProcessingStatus.OK == this.mValue) {
      // KO erases OK
      if (ProcessingStatus.KO == newValue) {
        this.mValue = ProcessingStatus.KO;
      }
    }
    // No else : Nothing erases KO
  },

  /**
    *
    *
    * return  Enum ProcessingStatus
    */
  checkNbPlayers : function(nbPlayers) {
    // Select the new value from its old value and the new value
    if (nbPlayers < 0) {
      // Not enough players
      this.process(this.mValue);
      this.mDetail = ProcessingStatus.DETAIL.NOT_ENOUGH_PLAYERS;
    }
  }

};

// Enum ProcessingStatus
ProcessingStatus.NOT_DONE = "Not done";
ProcessingStatus.OK = "Success";
ProcessingStatus.KO = "Fail";

ProcessingStatus.DETAIL = {};
ProcessingStatus.DETAIL.NOT_ENOUGH_PLAYERS = "There are not enough players (min 1 Player)";
ProcessingStatus.DETAIL.NOT_ENOUGH_CARDS = "There are not enough cards in your cardpool. Please check more expansions if each player has its own cards, or decrease the number of players if you are sharing your cards.";
