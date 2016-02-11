console.log('Constraint.js loaded');

/**
  * Class Constraint
  *
  * Constraint
  */
function Constraint(constraintJSON) {

  // CONSTRUCTOR
	this.mNbMin = constraintJSON.min;
	this.mNbMax = constraintJSON.max;
	this.mNbCurrent = 0;
  this.mType = constraintJSON.type;
	this.mScore = constraintJSON.score;

}//end Constraint

Constraint.prototype = {

  clone : function() {
    var clone = new Constraint({
      min:this.mNbMin,
      max:this.mNbMax,
      type:this.mType,
      score:this.mScore,
    });
    clone.mNbCurrent = this.mNbCurrent;
    return clone;
  },

  /**
    * Constraint is met if its current number is between min and max
    */
  isMet : function() {
    return ((this.mNbCurrent >= this.mNbMin) && (this.mNbCurrent <= this.mNbMax));
  },

  /**
    * Constraint is completely met if its current number equal to max
    */
  isCompletelyMet : function() {
    return (this.mNbCurrent == this.mNbMax);
  },

  /**
    * Meet the constraint if the type of the Constraint is in the specified array of types, then return the score
    *
    * return  Score
    */
  tryMeet : function(card) {
    var score = 0;  // Return score 0 by default
    // Search the type of the constraint in the types of the Card
    for (iType = 0; iType < card.mTypes.length; iType++) {
      // Compare the type of the constraint with the current type of the Card
      if (this.mType == card.mTypes[iType]) {
        // Check if the constraint is already completely met
        if (this.isCompletelyMet()) {
          // The constraint is completely met : Return a score of -1
          score = -1;
          break;  // Stop trying to meet the Constraint
        }
        else if (!this.isMet()) {
          // The constraint is not yet met : Return the score of the constraint
          score = this.mScore;
          break;  // Stop searching Types
        }
      }
    }
    return score;
  },

  /**
    * Meet the constraint with the specified Card
    *
    * return  void
    */
  meet : function(card) {
    // The type of the constraint in the types of the Card
    for (iType = 0; iType < card.mTypes.length; iType++) {
      // Compare the type of the constraint with the current type of the Card
      if (this.mType == card.mTypes[iType]) {
        // Check if the Constraint is not already completely met
        if (!this.isCompletelyMet()) {
          // Meet the Constraint by incrementing its number
          this.mNbCurrent++;
          break;  // Stop searching
        }
      }
    }
  }

};
