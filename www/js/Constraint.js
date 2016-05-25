console.log('Constraint.js loaded');

/**
  * Class Constraint
  *
  * Constraint
  */
function Constraint(nbCards, constraintJSON) {

  // CONSTRUCTOR
  this.mNbCards = nbCards;
  this.mConstraintJSON = constraintJSON;
  this.mNbMin = Math.floor(this.mConstraintJSON.min * this.mNbCards / 80);
  this.mNbMax = Math.floor(this.mConstraintJSON.max * this.mNbCards / 80);
  this.mNbCurrent = 0;
  this.mType = this.mConstraintJSON.type;
  this.mScore = this.mConstraintJSON.score;

}//end Constraint

Constraint.prototype = {

  clone : function() {
    var clone = new Constraint(this.mNbCards, this.mConstraintJSON);
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
    * Constraint is met if its current number is between min and max
    */
  isNotMet : function() {
    return (!this.isMet());
  },

  /**
    * Constraint is completely met if its current number equal to max
    */
  isCompletelyMet : function() {
    return (this.mNbCurrent == this.mNbMax);
  },

  /**
    * Constraint is not completely met if its current number is less than max
    */
  isNotCompletelyMet : function() {
    return (!this.isCompletelyMet());
  },

  /**
    * Meet the constraint if the type of the Constraint is in the specified array of types, then return the score
    *
    * return  Score
    */
  tryMeet : function(card) {
    var score = 0;  // Return score 0 by default
    // Search the type of the constraint in the types of the Card
    for (var iType = 0; iType < card.mTypes.length; iType++) {
      // Compare the type of the constraint with the current type of the Card
      if (this.mType == card.mTypes[iType]) {
        // Check if the constraint is already completely met
        if (this.isCompletelyMet()) {
          // The constraint is completely met : Return a score of -1
          score = -1;
          break;  // Stop trying to meet the Constraint
        }
        else if (this.isNotMet()) {
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
    for (var iType = 0; iType < card.mTypes.length; iType++) {
      // Compare the type of the constraint with the current type of the Card
      if (this.mType == card.mTypes[iType]) {
        // Check if the Constraint is not already completely met
        if (this.isNotCompletelyMet()) {
          // Meet the Constraint by incrementing its number
          this.mNbCurrent++;
          break;  // Stop searching
        }
      }
    }
  }

};
