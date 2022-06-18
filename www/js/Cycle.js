console.log('Cycle.js loaded');

/**
  * Class Cycle
  *
  * Definition of a Cycle
  */
function Cycle(cycleJSON) {

  // CONSTRUCTOR
  this.mCycleNo = cycleJSON.cycleNo;
  this.mNameEn = cycleJSON.nameEn;
  this.mNameFr = cycleJSON.nameFr;
  this.mType = cycleJSON.type;

}//end Cycle

Cycle.prototype = {

  /**
    * Get the name of the Cycle
    */
  getName: function (locale) {
    var name = this.mNameEn;  // Default name is in English

    // French Name
    if (("FR" == locale) && ("" != this.mNameFr)) {
      name = this.mNameFr;
    }

    return name;
  }

};
