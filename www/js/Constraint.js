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
  this.mNbMin = Math.round(this.mConstraintJSON.min * this.mNbCards / 45);
  this.mNbMax = Math.round(this.mConstraintJSON.max * this.mNbCards / 45);
  this.mNbCurrent = 0;
  this.mTypes = this.mConstraintJSON.types;
  this.mScore = this.mConstraintJSON.score;

}//end Constraint

Constraint.prototype = {

  clone : function() {
    var clone = new Constraint(this.mNbCards, this.mConstraintJSON);
    clone.mNbCurrent = this.mNbCurrent;
    return clone;
  },

  /**
    * Constraint is met if its current number is greater than min
    */
  isPartiallyMet : function() {
    return (this.mNbCurrent >= this.mNbMin);
  },

  /**
    * Constraint is met if its current number is less than min
    */
  isNotMet : function() {
    return (!this.isPartiallyMet());
  },

  /**
    * Constraint is completely met if its current number is equal to max
    */
  isCompletelyMet : function() {
    return (this.mNbCurrent >= this.mNbMax);
  },

  /**
    * Constraint is not completely met if its current number is less than max
    */
  isNotCompletelyMet : function() {
    return (!this.isCompletelyMet());
  },

  /**
    * Count the number of types of the constraint that are in the Card
    */
  getNbSameTypes : function(card) {
    var nbSameTypes = 0;
    // Count the number of types of the constraint that are in the Card
    for (var iConstraintType = 0; iConstraintType < this.mTypes.length; iConstraintType++) {
      for (var iCardType = 0; iCardType < card.mTypes.length; iCardType++) {
        if (this.mTypes[iConstraintType] == card.mTypes[iCardType]) {
          // The current types are the same
          nbSameTypes++;
        }
      }
    }
    return nbSameTypes;
  },

  /**
    * Check if the types of the constraint are in the given card
    */
  haveSameTypes : function(card) {
    // Get the number of same types between the constraint and the card
    var nbSameTypes = this.getNbSameTypes(card);
    // Check if the number of types found in the Card is equal to the number of types in the Constraint
    return (nbSameTypes == this.mTypes.length);
  },

  /**
    * Find if the types of the Constraint are in the given card.
    *
    * return  true : The card meets the constraint, false : The constraint is already completely met or the card does not meet the constraint
    */
  tryMeet : function(card) {
    if (this.isCompletelyMet()) {
      // The constraint is already completely met, don't check the card
      return false;
    }
    else {
      // Check if the card contains the types of the constraint
      return (this.haveSameTypes(card));
    }
  },

  /**
    * Check if the given card is going to overcomplete the constraint
    */
  isOvercompletedBy : function(card) {
    return (this.haveSameTypes(card) && this.isCompletelyMet());
  },

  /**
    * Check if the given card will not overcomplete the constraint
    */
  isNotOvercompletedBy : function(card) {
    return (!this.isOvercompletedBy(card));
  },

  /**
    * Meet the constraint with the specified Card
    *
    * return  void
    */
  meet : function(card) {
    // Check if the card contains the types of the constraint
    if (this.haveSameTypes(card)) {
        // Meet the Constraint by incrementing its number
        this.mNbCurrent++;
    }
  }

};
