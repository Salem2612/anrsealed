console.log('Constraints.js loaded');

/**
  * Class Constraints
  *
  * Array of Constraint
  */
function Constraints(nbCards, constraintsJSON, arePlayersNoobs) {

  // CONSTRUCTOR
  this.mNbCards         = nbCards;
  this.mArePlayersNoobs = arePlayersNoobs;
  this.mItems           = [];

  for (iConstraint = 0; iConstraint < constraintsJSON.length; iConstraint++) {
    // Clone the constraints JSON
    var constraintJSON = {};
    constraintJSON.min = constraintsJSON[iConstraint].min;
    constraintJSON.max = constraintsJSON[iConstraint].max;
    constraintJSON.types = constraintsJSON[iConstraint].types.slice(0);
    if (this.mArePlayersNoobs)
    {
      constraintJSON.types.push("NEWBIE");
    }
    this.mItems.push(new Constraint(this.mNbCards, constraintJSON));
  }

}//end Constraints

Constraints.prototype = {

  clone : function() {
    var clone = new Constraints(this.mNbCards, [], this.mArePlayersNoobs);
    clone.mItems = this.mItems.map(function(constraint) {
      return constraint.clone();
    });
    return clone;
  },

  /**
    * Constraints are met if none is not met
    *
    * return  Boolean
    *   - true : All constraints are met
    *   - false : At least one constraint is not met
    */
  areMet : function() {
    var constraintsAreMet = true;
    // Check if all constraints are not met
    for (iConstraint = 0; iConstraint < this.mItems.length; iConstraint++) {
      // Check if the current constraints is not met
      var isMet = this.mItems[iConstraint].isPartiallyMet();
      if (isMet == false) {
        constraintsAreMet = false;
        break;
      }
    }
    return constraintsAreMet;
  },

  /**
    * Constraints are not met if at least one constraint is not met
    *
    * return  Boolean
    *   - true : At least one constraint is not met
    *   - false : All constraints are met
    */
  areNotMet : function() {
    return !(this.areMet());
  },

  /**
    * Find if the card meets all the constraints.
    *
    * return  true : The card meets all the constraints, false : The constraint is already completely met or the card does not meet the constraint
    */
  AreNotOvercompletedBy : function(card) {
    var areNotOvercompleted = false;
    for (iConstraint = 0; iConstraint < this.mItems.length; iConstraint++) {
      if(this.mItems[iConstraint].isNotOvercompletedBy(card)) {
        // This card will not overcomplete this constraint
        areNotOvercompleted = true;
      }
      else {
        areNotOvercompleted = false;
        break; // Stop : This card is going to overcomplete a constraint
      }
    }
    return areNotOvercompleted;
  },

  /**
    * Meet the constraints that match with the specified Card
    *
    * return  void
    */
  meet : function(card) {
    // Meet the constraints that matches with the specified Card
    for (iConstraint = 0; iConstraint < this.mItems.length; iConstraint++) {
      this.mItems[iConstraint].meet(card);
    }
  }

};
