console.log('Sets.js loaded');

/**
  * Class Sets
  *
  * Array of Sets
  */
function Sets(setsJSON, cycles) {

  // CONSTRUCTOR
  this.mCycles = cycles;
  this.mItems = [];

  // Create Set Objects from Set JSON
  for (var iSet = 0; iSet < setsJSON.length; iSet++) {
    var setJSON = setsJSON[iSet];
    var cycle = this.mCycles.getCycle(setJSON.cycleNo);
    var set = new Set(setJSON, cycle);
    this.mItems.push(set);
  }

}//end Sets

Sets.prototype = {

  /**
    * Get the Set given by cycleNo and setNo
    */
  getSet: function (cycleNo, setNo) {
    var set;
    // Search the Set and return it
    for (var iSet = 0; iSet < this.mItems.length; iSet++) {
      // Compare the No of the current Cycle and Set with the specified No
      if ((this.mItems[iSet].mCycleNo == cycleNo) && (this.mItems[iSet].mSetNo == setNo)) {
        // Set found
        set = this.mItems[iSet];
        break;  // Stop searching
      }
    }
    return set;
  }

};
