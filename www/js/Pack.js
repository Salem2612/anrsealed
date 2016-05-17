console.log('Pack.js loaded');

/**
  * Class Pack
  *
  * Pack of Cards of a Side.
  */
function Pack(cardPool) {

  // CONSTRUCTOR
  this.mCardPool = cardPool;    // Pool of available Cards to generate the Sealed Pack
  this.mType = cardPool.mType;  // Type of the Sealed Pack (STARTER or BOOSTER)
  this.mSide = cardPool.mSide;  // Side of the Sealed Pack
  this.mConstraints = cardPool.mConstraints.clone();  // Constraints of the Sealed Pack
  this.mCards = new Cards([], cardPool.mDatabase.mSets);  // Cards in the Sealed Pack

}

Pack.prototype = {

  /**
    * Generate the Sealed Pack
    */
	generate : function() {
    var processingStatus = new ProcessingStatus();

    // Pick cards from the CardPool while all constraints are not met and there is still useful Cards in the CardPool to meet the constraints
    while(this.mConstraints.areNotMet())
    {
      // Calculate the score of the Cards of the CardPool
      var highScore = this.mCardPool.mCards.calculateScores(this.mConstraints);
      // Check if there is still useful Cards in the CardPool to meet the constraints
      if (highScore == 0) {
        // Stop generating if all the constraints are not met and there is no Card to add
        processingStatus.process(ProcessingStatus.KO);
        break;
      }
      // Pick a random Card among the High Scored Cards of the CardPool
      var card = this.mCardPool.mCards.pickRandomCardFromScore(highScore);
      // Meet the constraints that matches with the picked Card
      this.mConstraints.meet(card);
      // Put the picked Card in the SealedPool
      this.mCards.add(card);
    }

    // Check if the generation is OK
    if (this.mConstraints.areMet()) {
      processingStatus.process(ProcessingStatus.OK);
    }
    return processingStatus.mValue;
	},

  /**
    * Generate and return the Sealed Pack as Text
    */
  generateTextFileSortedByCardType : function(locale) {
    var textFile = "";
    // List the types to sort the Cards in the Text File
    var types = CardTypes[this.mSide];

    // Sort the Sealed Pack by Card Name
    this.mCards.sortByName(locale);

    // Calculate the statistics of the Sealed Pack
    var statistics = {};
    for (var iType in types) {
      var type = types[iType];
      statistics[type] = 0;
      for (var iCard = 0; iCard < this.mCards.mItems.length; iCard++) {
        var card = this.mCards.mItems[iCard];
        if (card.hasType(type)) {
          statistics[type] += card.mNbCopies;
        }
      }
    }

    // Create the Text File
    for (var iType in types) {
      var type = types[iType];
      // Print only non empty Types
      if (statistics[type] != 0) {
        // Print the current Type and its statistic in the Text File
        textFile += type + "(" + statistics[type] + ")\r\n";
        // Print the Cards of the current Type in the Text File
        for (iCard = 0; iCard < this.mCards.mItems.length; iCard++) {
          var card = this.mCards.mItems[iCard];
          if (card.hasType(type)) {
            textFile += card.getText(locale);
          }
        }
        // Print a blank line in the Text File
        textFile += "\r\n";
      }
    }
    return textFile;
  },

  /**
    * Generate the Text File of the Sealed Pack sorted by alphabetical order
    */
  generateTextFileSortedByAlphabeticalOrder : function(locale) {
    // Create the Text File of the Sealed Pack
    var textFile = "";

    // Sort the Sealed Pack by Name
    this.mCards.sortByName(locale);

    // Add "The Shadow: Pulling the Strings" or "The Masque" to improve importing in Netrunner DB
    textFile = (Side.CORP == this.mSide) ? "The Shadow: Pulling the Strings\r\n\r\n" : "The Masque\r\n\r\n";

    // Create the Text File
    for (iCard = 0; iCard < this.mCards.mItems.length; iCard++) {
      var card = this.mCards.mItems[iCard];
      // Add a new line between each letter
      if (iCard != 0) {
        // Retrieve the first letter of the previous Card
        var firstLetterPrev = this.mCards.mItems[iCard-1].getName(locale).toLocaleLowerCase().charAt(0);
        // Retrieve the first letter of the current Card
        var firstLetterCurrent = card.getName(locale).toLocaleLowerCase().charAt(0);
        // Compare the first letters of the 2 Cards
        if (firstLetterPrev != firstLetterCurrent) {
          textFile += "\r\n";
        }
      }
      // Add the card in the text file
      textFile += card.getText(locale);
    }
    return textFile;
  },

  /**
    * Generate the Text File of the Sealed Pack with all information of the cards
    */
  generateTextFileFull : function(locale) {
    // Create the Text File of the Sealed Pack
    var textFile = "";

    // Sort the Sealed Pack by Name
    this.mCards.sortByName(locale);
    this.mCards.sortByType(locale);

    // Create the Text File
    for (iCard = 0; iCard < this.mCards.mItems.length; iCard++) {
      var card = this.mCards.mItems[iCard];
      // Add the card in the text file
      textFile += card.getFullText(locale);
    }
    return textFile;
  },

  /**
    * Generate the Text File of the Sealed Pack sorted by Faction then by Card Type
    */
  generateTextFileSortedByFactionType : function(locale) {
    // Create the Text File of the Sealed Pack
    var textFile = "";

    // Sort the Sealed Pack by Name
    var types = CardTypes[this.mSide];
    this.mCards.sortByFactionThenTypeThenName(types, locale);

    // Create the Text File
    for (iCard = 0; iCard < this.mCards.mItems.length; iCard++) {
      var card = this.mCards.mItems[iCard];
      // Add the Faction and Type title
      if (iCard == 0)
      {
        // Always print the Faction and Type title for the first Card
        textFile += card.mFaction + " / " + card.findType(types) + "\r\n";
      }
      else
      {
        prevCard = this.mCards.mItems[iCard-1];
        // Print the Faction and Type title if the faction or the Type are different
        if ((prevCard.mFaction != card.mFaction) || (prevCard.findType(types) != card.findType(types)))
        {
          textFile += "\r\n" + card.mFaction + " / " + card.findType(types) + "\r\n";
        }
      }
      // Add the card in the text file
      textFile += card.getText(locale);
    }
    return textFile;
  },

  /**
    * Generate the Text File of the Sealed Pack sorted by Cycle then by Set
    */
  generateTextFileSortedByCycleSet : function(locale) {
    // Create the Text File of the Sealed Pack
    var textFile = "";

    // Sort the Sealed Pack by Name
    this.mCards.sortByCardId();

    // Create the Text File
    for (iCard = 0; iCard < this.mCards.mItems.length; iCard++) {
      var card = this.mCards.mItems[iCard];
      // Add the Cycle and Set title
      if (iCard == 0)
      {
        // Always print the Cycle and Set title for the first Card
        var cycleName = card.mSet.mCycle.getName(locale);
        var setName = card.mSet.getName(locale);
        if (cycleName != setName)
        {
          textFile += cycleName + " / " + setName + "\r\n";
        }
        else
        {
          textFile += cycleName + "\r\n";
        }
      }
      else
      {
        prevCard = this.mCards.mItems[iCard-1];
        // Print the Cycle and Set title if the sets are different
        var cycleName = card.mSet.mCycle.getName(locale);
        var setName = card.mSet.getName(locale);
        if (prevCard.mSet.getName(locale) != setName)
        {
          if (cycleName != setName)
          {
            textFile += "\r\n" + cycleName + " / " + setName + "\r\n";
          }
          else
          {
            textFile += "\r\n" + cycleName + "\r\n";
          }
        }
      }
      // Add the card in the text file
      textFile += card.getText(locale);
    }
    return textFile;
  }

};
