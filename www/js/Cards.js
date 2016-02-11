console.log('Cards.js loaded');

/**
  * Class Cards
  *
  * Array of Cards
  */
function Cards(cardsJSON) {

  // CONSTRUCTOR
  this.mItems = [];

  // Create Card Objects from Card JSON
  for (var iCard = 0; iCard < cardsJSON.length; iCard++) {
    this.mItems.push(new Card(cardsJSON[iCard]));
  }

}//end Cards

Cards.prototype = {

  clone : function() {
    var clone = new Cards([]);
    clone.mItems = this.mItems.map(function(card) {
      return card.clone();
    });
    return clone;
  },

  /**
    *
    */
	getName : function(cardId) {
    var name = "";
    // Search the ID of the card and return its name
    for (var iCard = 0; iCard < this.mItems.length; iCard++) {
      // Compare the ID of the current Card with the specified ID
      if (this.mItems[iCard].id == cardId) {
        // Card found
        name = this.mItems[iCard].nameEn;
        break;  // Stop searching
      }
    }
    return name;
	},

  /**
    * Calculate the score of the Cards with the specified constraints and return the High Score.
    *
    * return  highScore
    */
	calculateScores : function(constraints) {
    var highScore = 0;
    // Calculate the score of each card and sort them with the higher score first
    for (iCard = 0; iCard < this.mItems.length; iCard++) {
      // Calculate the score of the current Card
      var score = this.mItems[iCard].calculateScore(constraints);
      // Store the new high score
      if (score > highScore) {
        highScore = score;
      }
    }
    return highScore;
	},

  /**
    * Filter the Cards with the specified score and pick one of them at random.
    *
    * return  Picked Card with a score
    */
  pickRandomCardFromScore : function(score) {
    // Filter (and return shallow copy) the array of Cards to keep only Cards with the specified score
    var highScoredCards = this.mItems.filter(function(card) {
      return (card.mScore == score);
    });
    // Choose a random Card among the Cards with the specified score
    var iRandomCard = Math.floor(Math.random() * highScoredCards.length);
    // Find the Card in the whole Cards
    var iCard = this.mItems.indexOf(highScoredCards[iRandomCard]);
    // Clone the Card to return it
    var card = this.mItems[iCard].clone();
    // Pick only one Card
    card.mNbCopies = 1;
    // Decrease the amount of that Card in the Array
    this.mItems[iCard].mNbCopies--;
    return card;
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
    // Sort the Cards by Rarity
    this.mItems.sort(function(card1, card2) {
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
  }

};
