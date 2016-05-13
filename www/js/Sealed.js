console.log('Sealed.js loaded');

/**
  * Class Sealed
  *
  * Manage the Sealed Game
  */
function Sealed(nbPlayers, cardPools, useOneCardPool, version) {

  // CONSTRUCTOR
	this.mNbPlayers = nbPlayers;  // Number of Players
  this.mCardPools = cardPools; // Available CardPools in the Sealed
  this.mUseOneCardPool = useOneCardPool; // true : Use only one cardpool for all players. false : Use one cardpool per player
  this.mPlayers = []; // Players in the Sealed
  this.mVersion = version;

}//end Sealed

Sealed.prototype = {

  /**
    * Generate the Sealed Game
    *
    * return  ProcessingStatus.mValue
    */
  generate : function() {
    var processingStatus = new ProcessingStatus();

    // Generate the Sealed Packs of all players
    for (iPlayer = 0; iPlayer < this.mNbPlayers; iPlayer++) {

      // Manage the cardpools
      var cardPools = {};
      if (this.mUseOneCardPool)
      {
        // Use the same cards
        cardPools = this.mCardPools;
      }
      else
      {
        // Clone the cards and the constraint for the current player
        for (var side in Side) {
          cardPools[side] = this.mCardPools[side].clone();
        }
      }

      // Create the current Player
      this.mPlayers[iPlayer] = new Player("Player " + (iPlayer+1), cardPools);
      // Generate the current Player
      processingStatus.process(this.mPlayers[iPlayer].generate());
    }

    return processingStatus.mValue;
  },

  /**
    * Download the Sealed Packs.
    *
    * database :
    * sealedPacks :
    *
    * return  void
    */
  download : function() {
    var zip = new JSZip();
    // Generate and Zip the Players files
    for (var iPlayer = 0; iPlayer < this.mNbPlayers; iPlayer++) {
      var player = this.mPlayers[iPlayer];
      for (var locale of ["EN", "FR"])
      {
        // Generate the Sealed Pack Files of the current Player
        for (var side in Side) {
          var sideName = side[0].toUpperCase() + side.substr(1).toLowerCase();
          var fileName = "Sealed Pack - " + player.mName + " - " + sideName + ".txt";
          var sortedByCardTypeFileName = "Sealed Pack - " + player.mName + " - Sorted by card type - " + locale + " - " + sideName +".txt";
          var alphabeticalFileName = "Sealed Pack - " + player.mName + " - Sorted by alphabetical order - " + locale + " - " + sideName +".txt";

          // Generate the file sorted by card type
          var textFile = player.generateTextFileSortedByCardType(side, locale);
          // Add the Text File to the ZIP file
          zip.file("Sorted by card type/" + locale + "/" + fileName, textFile);
          zip.file("All/" + player.mName + "/" + sortedByCardTypeFileName, textFile);

          // Generate the Sealed Pack File sorted Alphabetically
          var textFile = player.generateTextFileSortedByAlphabeticalOrder(side, locale);
          // Add the Text File to the ZIP file
          zip.file("Sorted by alphabetical order/" + locale + "/" + fileName, textFile);
          zip.file("All/" + player.mName + "/" + alphabeticalFileName, textFile);
        }
      }
    }

    // Generate ZIP
    var content = zip.generate({type:"blob"});
    // Download ZIP
    var zipName = "Sealed Packs v" + this.mVersion + ".zip";
    saveAs(content, zipName);
  }
};

