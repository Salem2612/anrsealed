console.log('Constraints.js loaded');

/**
  * Class Constraints
  *
  * Array of Constraint
  */
function Constraints(constraintsJSON) {

  // CONSTRUCTOR
  this.mItems = [];

  for (iConstraint = 0; iConstraint < constraintsJSON.length; iConstraint++) {
    this.mItems[iConstraint] = new Constraint(constraintsJSON[iConstraint]);
  }

}//end Constraints

Constraints.prototype = {

  clone : function() {
    var clone = new Constraints([]);
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
      var isMet = this.mItems[iConstraint].isMet();
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
    * Meet the constraints that matches with the specified Card
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
