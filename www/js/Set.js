console.log('Set.js loaded');

/**
  * Class Set
  *
  * Definition of a Set
  */
function Set(setJSON, cycle) {

  // CONSTRUCTOR
  this.mCycleNo = setJSON.cycleNo;  // Identifier of the cycle
  this.mCycle = cycle;            // Cycle of the Set
  this.mSetNo = setJSON.setNo;    // Identifier of the set
  this.mNameEn = setJSON.nameEn;   // Name of the set (English)
  this.mNameFr = setJSON.nameFr;   // Name of the set (French)
  this.mType = setJSON.type;     // Type of the set (CORE_SET, DELUXE, DATA_PACK)

}//end Set

Set.prototype = {

  /**
    * Get the name of the Set
    */
  getCycleAndSetNames: function (locale) {
    // Return only one name if the Cycle and Set names are identical, otherwise return the Cycle and Set names separated by a comma.
    var cycleName = this.mCycle.getName(locale);
    var setName = this.getName(locale);
    var name = (cycleName == setName) ? (setName) : (cycleName + ", " + setName);
    return name;
  },

  /**
    * Get the name of the Set
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
