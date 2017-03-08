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
    * Reset the status
    *
    * return  Enum ProcessingStatus
    */
  reset : function() {
    this.mValue = ProcessingStatus.NOT_DONE;
    this.mDetail = ProcessingStatus.DETAIL.NOT_ENOUGH_CARDS;
  },

  /**
    *
    *
    * return  Enum ProcessingStatus
    */
  process : function(newValue, log) {
    // Log the changing of the status
    if ((ProcessingStatus.KO == newValue) && this.mValue != newValue) {
      anrsealedLogs.push("ProcessingStatus.process() becomes KO in class " + log);
    }

    // Select the new value from its old value and the new value
    if (ProcessingStatus.NOT_DONE == this.mValue) {
      // Anything erases NOT_DONE
      this.mValue = newValue;
    }
    else if ((ProcessingStatus.OK == this.mValue) && (ProcessingStatus.KO == newValue)) {
      // KO erases OK
      this.mValue = ProcessingStatus.KO;
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
      this.process(this.mValue, "ProcessingStatus.checkNbPlayers");
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
