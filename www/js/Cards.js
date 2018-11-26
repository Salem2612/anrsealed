console.log('Cards.js loaded');

/**
  * Class Cards
  *
  * Array of Cards
  */
function Cards(cardsJSON, sets) {

  // CONSTRUCTOR
  this.mItems = [];
  this.mAvailableCards = [];
  this.mSets  = sets;

  // Create Card Objects from Card JSON
  for (var iCard = 0; iCard < cardsJSON.length; iCard++) {
    var cardJSON = cardsJSON[iCard];
    var set = this.mSets.getSet(cardJSON.cycleNo, cardJSON.setNo);
    var card = new Card(cardJSON, set);
    this.mItems.push(card);
  }

}//end Cards

Cards.prototype = {

  clone : function() {
    var clone = new Cards([], this.mSets);
    clone.mItems = this.mItems.map(function(card) {
      return card.clone();
    });
    return clone;
  },

  /**
    * Filter the Cards that meet the Constraint and pick one of them at random.
    *
    * return  Picked Card
    */
  pickRandomCard : function(constraint, constraints) {
    // Filter (and return shallow copy of) the array of Cards to keep only Cards that meet the Constraint
    this.mAvailableCards = this.mItems.filter(function(card) {
      return ((card.mNbCopies > 0) && constraint.tryMeet(card) && constraints.AreNotOvercompletedBy(card));
    });

    // Get the number of available copies
    var nbAvailableCopies = this.getNbAvailableCopies();

    // Pick a random card among the available cards
    var card;
    if (nbAvailableCopies > 0) {
      // Choose a random Card among the Cards that meet the constraints
      var iRandomCard = Math.floor(Math.random() * this.mAvailableCards.length);
      // Find the Card in the whole Cards
      var iCard = this.mItems.indexOf(this.mAvailableCards[iRandomCard]);
      // Clone the Card to return it
      card = this.mItems[iCard].clone();
      // Pick only one Card
      card.mNbCopies = 1;
      // Decrease the amount of that Card in the Array
      this.mItems[iCard].mNbCopies--;
      this.mItems[iCard].mNbAvailableCopies--;
    }
    return {"nbAvailableCopies" : nbAvailableCopies, "card" : card};
  },

  getNbAvailableCopies : function() {
    var nbAvailableCopies = 0;
    for (var iCard = 0; iCard < this.mAvailableCards.length; iCard++) {
      nbAvailableCopies += this.mAvailableCards[iCard].mNbCopies;
    }
    return nbAvailableCopies;
  },

  /**
    * Add the specified Card in the Array :
    *   - Push it in the Array if it does not exist in the Array
    *   - Increase its Number of Copies if it already exists in the Array
    *
    * return  void
    */
  add : function(card) {
    // Search the index of the specified Card
    var iCard = this.indexOf(card);
    // Check if the Card exists in the Array
    if (-1 == iCard) {
      // The Card does not exist in the Array : Push it in the Array
      this.mItems.push(card);
    }
    else {
      // The Card exists in the Array : Increase its Number of Copies
      this.mItems[iCard].mNbCopies += card.mNbCopies;
    }
  },

  /**
    * Sort the Cards by Rarity (FIXED first), then by name inside each Rarity
    *
    * return  void
    */
  sortByRarity : function(locale) {
    // Sort the Cards by Rarity
    this.mItems.sort(function(card1, card2) {
      var rarity1 = card1.getRarity();
      var rarity2 = card2.getRarity();
      /* Truth Table :
      rarity1   rarity2   return
      =         =         name1 - name2
      FIXED     x         -1
      COMMON    FIXED     1
      COMMON    >         -1
      UNCO      FIXED     1
      UNCO      COMMON    1
      UNCO      >         -1
      RARE      FIXED     1
      RARE      COMMON    1
      RARE      UNCO      1
      */
      if (rarity1 == rarity2) {
        // Retrieve the names of the cards
        var name1 = card1.getName(locale);
        var name2 = card2.getName(locale);
        // Compare the names of the cards
        if (name1 < name2) {
          return -1;
        }
        else if (name1 > name2) {
          return 1;
        }
        else {
          return 0;
        }
      }
      else if (rarity1 == CardType.FIXED) {
        return -1;
      }
      else if (rarity1 == CardType.COMMON) {
        if (rarity2 == CardType.FIXED) {
          return 1;
        }
        else {
          return -1;
        }
      }
      else if (rarity1 == CardType.UNCO) {
        if ((rarity2 == CardType.FIXED) || (rarity2 == CardType.COMMON)) {
          return 1;
        }
        else {
          return -1;
        }
      }
      else if (rarity1 == CardType.RARE) {
        if ((rarity2 == CardType.FIXED) || (rarity2 == CardType.COMMON) || (rarity2 == CardType.UNCO)) {
          return 1;
        }
        else {
          return -1;
        }
      }
      // Never reached
      console.log("Error in Sorting the Cards by Rarity");
      return 0;
    });
  },

  /**
    * Sort by name using locale
    *
    * return  void
    */
  sortByName : function(locale) {
    // Sort the Cards by Name
    this.mItems.sort(function(card1, card2) {
      // Compare the names of the cards
      return card1.getName(locale).localeCompare(card2.getName(locale));
    });
  },

  /**
    * Sort by Faction, then by Card Type, then by Name
    *
    * return  void
    */
  sortByFactionThenTypeThenName : function(types, locale) {
    // Sort the Cards by Faction, then by Card Type, then by Name
    this.mItems.sort(function(card1, card2) {
      // Compare the factions of the cards, then the Types, then the names
      if (card1.mFaction < card2.mFaction) return -1;
      if (card1.mFaction > card2.mFaction) return 1;
      if (card1.findType(types) < card2.findType(types)) return -1;
      if (card1.findType(types) > card2.findType(types)) return 1;
      return card1.getName(locale).localeCompare(card2.getName(locale));
    });
  },

  /**
    * Sort by Card Type
    *
    * return  void
    */
  sortByType : function(types) {
    // Sort the Cards by Rarity
    this.mItems.sort(function(card1, card2) {
      // Compare the Types of the cards
      return card1.findType(types).localeCompare(card2.findType(types));
    });
  },

  /**
    * Sort by cardId
    *
    * return  void
    */
  sortByCardId : function(types) {
    // Sort the Cards by Rarity
    this.mItems.sort(function(card1, card2) {
      // Compare the Types of the cards
      return card1.mId.localeCompare(card2.mId);
    });
  },

  /**
    * Check if the specified Card exists in the Array
    *
    * return  Index of the Card found in the Array. -1 if the Card does not exist in the Array.
    */
  indexOf : function(card) {
    var index = -1; // Initialize to "not found"
    // Check if the specified Card exists in the Array
    for (var iCard = 0; iCard < this.mItems.length; iCard++) {
      // Check the ID of the Cards
      if (this.mItems[iCard].mId == card.mId) {
        index = iCard;  // Return the index of the Card found
        break;  // Stop searching
      }
    }
    return index;
  },

  /**
    * Get the number of copies of cards
    *
    * return  Number of copies of cards
    */
  getNbCards : function() {
    var nbCards = 0;
    for (var iCard = 0; iCard < this.mItems.length; iCard++) {
      nbCards += this.mItems[iCard].mNbCopies;
    }
    return nbCards;
  }

};
