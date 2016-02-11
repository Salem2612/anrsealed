console.log('Sealed.js loaded');

/**
  * Class Sealed
  *
  * Manage the Sealed Game
  */
function Sealed(nbPlayers, sidesCardPools, version) {

  // CONSTRUCTOR
	this.mNbPlayers = nbPlayers;  // Number of Players
  this.mSidesCardPools = sidesCardPools; // Available CardPools in the Sealed
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
      // Clone the SidesCardPools
      var sidesCardPools = {};
      for (var side in Side) {
        sidesCardPools[side] = [];
        for (var iCardPool = 0; iCardPool < this.mSidesCardPools[side].length; iCardPool++)
        {
          sidesCardPools[side].push(this.mSidesCardPools[side][iCardPool].clone());
        }
      }
      // Create the current Player
      this.mPlayers[iPlayer] = new Player("Player " + (iPlayer+1), sidesCardPools);
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
        // Generate the Sealed Pool Files of the current Player
        for (var side in Side) {
          var sideName = side[0].toUpperCase() + side.substr(1).toLowerCase();
          var fileName = "Sealed Pack - " + player.mName + " - " + sideName + ".txt";
          var starterBoostersFileName = "Sealed Pack - " + player.mName + " - StarterBoosters - " + locale + " - " + sideName +".txt";
          var rarityFileName = "Sealed Pack - " + player.mName + " - Rarity - " + locale + " - " + sideName +".txt";
          var alphabeticalFileName = "Sealed Pack - " + player.mName + " - Alphabetical Order - " + locale + " - " + sideName +".txt";

          // Generate the Sorted Sealed Pack Files of the current Sealed Pool
          var textFile = player.generateTextFileSorted(side, locale);
          // Add the Text File to the ZIP file
          zip.file("Sorted by Starter and Boosters/" + locale + "/" + fileName, textFile);
          zip.file("All/" + player.mName + "/" + starterBoostersFileName, textFile);

          // Generate the Sealed Pack Files of the current Sealed Pool sorted by Rarity
          var textFile = player.generateTextFileRarity(side, locale);
          // Add the Text File to the ZIP file
          zip.file("Sorted by Rarity/" + locale + "/" + fileName, textFile);
          zip.file("All/" + player.mName + "/" + rarityFileName, textFile);

          // Generate the Sealed Pack Files sorted Alphabetically of the current Sealed Pool
          var textFile = player.generateTextFileAlphabetical(side, locale);
          // Add the Text File to the ZIP file
          zip.file("Sorted by Alphabetical Order/" + locale + "/" + fileName, textFile);
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

