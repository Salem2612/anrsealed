console.log('Player.js loaded');

/**
  * Class Player
  *
  * Manage the cards of a Player
  */
function Player(name, cardPools) {

  // CONSTRUCTOR
	this.mName = name;  // Name of the Player
  this.mCardPools = cardPools;  // Pool of available cards
  this.mSealedPools = {}; // Packs

}//end Player

Player.prototype = {

  /**
    * Geenrate the Sealed Pools of the Player
    */
  generate : function() {
    var processingStatus = new ProcessingStatus();
    // Generate the SealedPools of each Side
    for (var side in Side) {
      // Generate the current Pack with the current CardPool
      var pack = new Pack(this.mCardPools[side]);
      processingStatus.process(pack.generate());
      this.mSealedPools[side] = pack;
    }
    return processingStatus.mValue;
  },

  /**
    * Generate the Text File of a Sealed Pool of the Player sorted by Starter and Boosters
    */
  generateTextFileSorted : function(side, locale) {
    var sealedPool = this.mSealedPools[side];
    var textFile = "";
    // Retrieve the compacted list of cards in the Sealed Pool
    for (var iPack = 0; iPack < sealedPool.length; iPack++) {
      var sealedPack = sealedPool[iPack];
      // Generate the Text File of the current Pack
      textFile += sealedPack.generateTextFile(locale);
      textFile += "-------------------------------------------\r\n";
    }
    return textFile;
  },


  /**
    * Generate the Text File of a Sealed Pool of the Player sorted by Rarity
    */
  generateTextFileRarity : function(side, locale) {
    var compactedCards = this.compactSealedPool(side, locale);

    // Sort the Compacted Cards by Rarity
    compactedCards.sortByRarity(locale);

    // Create the Text File of the Compacted Cards
    var textFile = "";
    for (iCard = 0; iCard < compactedCards.mItems.length; iCard++) {
      var card = compactedCards.mItems[iCard];
      textFile += card.getTextWithRarity(locale);
    }
    return textFile;
  },

  /**
    * Generate the Text File of a Sealed Pool of the Player sorted by alphabetical order
    */
  generateTextFileAlphabetical : function(side, locale) {
    var compactedCards = this.compactSealedPool(side, locale);

    // Sort the Compacted Cards by Rarity
    compactedCards.sortByName(locale);

    // Create the Text File of the Compacted Cards
    var textFile = "";
    // Add "The Shadow: Pulling the Strings" or "The Masque" to improve importing
    if (Side.CORP == side) {
      textFile = "The Shadow: Pulling the Strings\r\n\r\n";
    }
    else if (Side.RUNNER == side) {
      textFile = "The Masque\r\n\r\n";
    }
    // Create the Text File
    for (iCard = 0; iCard < compactedCards.mItems.length; iCard++) {
      var card = compactedCards.mItems[iCard];
      // Add a new line between each letter
      if (iCard != 0) {
        // Retrieve the first letter of the previous Card
        var firstLetterPrev = compactedCards.mItems[iCard-1].getName(locale).toLocaleLowerCase().charAt(0);
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
    * Compact a Sealed Pool
    */
  compactSealedPool : function(side, locale) {
    var sealedPool = this.mSealedPools[side];
    var compactedCards = new Cards({});
    // Compact each Pack
    for (var iPack = 0; iPack < sealedPool.length; iPack++) {
      var cards = sealedPool[iPack].mCards.clone();
      for (var iCard = 0; iCard < cards.mItems.length; iCard++) {
        compactedCards.add(cards.mItems[iCard]);
      }
    }
    return compactedCards;
  }

};
