console.log('Pack.js loaded');

/**
  * Class Pack
  *
  * Pack of Cards of a Side.
  */
function Pack(cardPool, type) {

  // CONSTRUCTOR
  this.mCardPool    = cardPool;       // Pool of available Cards to generate the Sealed Pack
  this.mType        = type;           // Type of the Sealed Pack (STARTER or BOOSTER)
  this.mSide        = cardPool.mSide; // Side of the Sealed Pack
  this.mConstraints = (type == "STARTER") ? cardPool.mStarterConstraints.clone() : cardPool.mBoosterConstraints.clone();  // Constraints of the Sealed Pack
  this.mCards       = new Cards([], cardPool.mDatabase.mSets);  // Cards in the Sealed Pack
}

Pack.prototype = {

  /**
    * Generate the Sealed Pack
    */
	generate : function() {
    var processingStatus = new ProcessingStatus();

    // Pick cards from the CardPool to meet all constraints
    for (var iConstraint = 0; iConstraint < this.mConstraints.mItems.length; iConstraint++) {
      var constraint = this.mConstraints.mItems[iConstraint];
      var log = " > Constraint : " + constraint.getTextTypes() + " : [" + constraint.mNbMin + ";" + constraint.mNbMax + "]";
      anrsealedLogs.push(log);

      // Pick cards from the CardPool while the constraint is not met and there is still useful Cards in the CardPool to meet the constraint
      while(constraint.isNotMet())
      {
        // Pick a random Card that meets the constraint
        var nbAvailableCopies_card = this.mCardPool.mCards.pickRandomCard(constraint, this.mConstraints);
        var nbAvailableCopies = nbAvailableCopies_card.nbAvailableCopies;
        var card = nbAvailableCopies_card.card;
        // Check if a card has been found
        if (nbAvailableCopies > 0)
        {
          // Meet the constraints that match with the picked Card
          this.mConstraints.meet(card);
          // Put the picked Card in the SealedPool
          this.mCards.add(card);
          var log = "  - " + card.mNameEn + " " + card.getTextTypes() + " (Among " + nbAvailableCopies + " cards)";
          anrsealedLogs.push(log);
          // console.log(log); // Uncomment to debug
        }
        else
        {
          // Stop generating if there is not enough cards to finish to meet the constraint
          processingStatus.process(ProcessingStatus.KO, "Pack for constraint " + constraint.getTextTypes() + " : " + constraint.mNbCurrent + " < [" + constraint.mNbMin + ";" + constraint.mNbMax + "]");
          break;
        }
      }
    }

    // Check if the generation is OK
    if (this.mConstraints.areMet()) {
      processingStatus.process(ProcessingStatus.OK, "Pack");
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

    // Add "The Shadow: Pulling the Strings" or "The Masque" at the begginning of the Starter to improve importing in Netrunner DB
    if (this.type == "STARTER") {
      textFile = (Side.CORP == this.mSide) ? "The Shadow: Pulling the Strings\r\n\r\n" : "The Masque\r\n\r\n";
    }

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
  },

  /**
   * Generate the XML File of the Sealed Pack in OCTGN Format
   */
  generateXmlFileOctgn : function(locale) {
    let xmlFile = "";

    this.mCards.sortByCardId();

    // Header
    xmlFile += '<?xml version="1.0" encoding="utf-8" standalone="yes"?>\r\n';
    xmlFile += '<deck game="0f38e453-26df-4c04-9d67-6d43de939c77">\r\n';

    xmlFile += '<section name="Sealed Pack">\r\n';

    for (const card of this.mCards.mItems) {
      const qty = card.mNbCopies;
      const id = card.mId;
      const name = card.getName(locale).replace(/&/g, '&amp;').replace(/</g, '&lt;');
      xmlFile += `<card qty="${qty}" id="bc0f047c-01b1-427f-a439-d451eda${id}">${name}</card>\r\n`;
    }

    xmlFile += '</section>\r\n';

    // If the pack has no identity card, we add a neutral draft identity so that NetrunnerDB
    // does not automatically fill in Noise or ETF instead when importing the deck.
    let hasIdentity = false;
    for (const card of this.mCards.mItems) {
      if (card.hasType(CardType.IDENTITY)) {
        hasIdentity = true;
        break;
      }
    }

    if (!hasIdentity) {
      xmlFile += '<section name="Neutral Identity">\r\n';
      if (this.mSide == Side.CORP) {
        xmlFile += '<card qty="1" id="bc0f047c-01b1-427f-a439-d451eda00005">The Shadow: Pulling the Strings</card>\r\n';
      } else {
        xmlFile += '<card qty="1" id="bc0f047c-01b1-427f-a439-d451eda00006">The Masque: Cyber General</card>\r\n';
      }
      xmlFile += '</section>\r\n';
    }

    // Footer
    xmlFile += '</deck>\r\n';

    return xmlFile;
  }

};
