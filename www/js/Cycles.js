console.log('Cycles.js loaded');

/**
  * Class Cycles
  *
  * Array of Cycles
  */
function Cycles(cyclesJSON) {

  // CONSTRUCTOR
  this.mItems = [];

  // Create Cycle Objects from Cycle JSON
  for (var iCycle = 0; iCycle < cyclesJSON.length; iCycle++) {
    this.mItems.push(new Cycle(cyclesJSON[iCycle]));
  }

}//end Cycles

Cycles.prototype = {

  /**
    *
    */
	getCycle : function(cycleNo) {
    var cycle;
    // Search the Cycle and return it
    for (var iCycle = 0; iCycle < this.mItems.length; iCycle++) {
      // Compare the No of the current Cycle with the specified No
      if (this.mItems[iCycle].mCycleNo == cycleNo) {
        // Cycle found
        cycle = this.mItems[iCycle];
        break;  // Stop searching
      }
    }
    return cycle;
	}

};
