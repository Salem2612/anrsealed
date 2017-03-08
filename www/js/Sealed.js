console.log('Sealed.js loaded');

/**
  * Class Sealed
  *
  * Manage the Sealed Game
  */
function Sealed(nbPlayers, cardPools, nbStarters, nbBoosters, useOneCardPool, version) {

  // CONSTRUCTOR
	this.mNbPlayers       = nbPlayers;  // Number of Players
  this.mCardPools       = cardPools;  // Available CardPools in the Sealed
	this.mNbStarters      = nbStarters; // Number of Starters per player
	this.mNbBoosters      = nbBoosters; // Number of Boosters per player
  this.mUseOneCardPool  = useOneCardPool; // true : Use only one cardpool for all players. false : Use one cardpool per player
  this.mPlayers         = []; // Players in the Sealed
  this.mVersion         = version;

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
      for (var side in Side) {
        if (this.mUseOneCardPool)
        {
          // Use the same cards
          cardPools[side] = this.mCardPools[side].fill();
        }
        else
        {
        // Clone the cards
          cardPools[side] = this.mCardPools[side].clone();
        }
      }

      // Create the current Player
      this.mPlayers[iPlayer] = new Player(iPlayer+1, cardPools, this.mNbStarters, this.mNbBoosters);
      // Generate the current Player
      processingStatus.process(this.mPlayers[iPlayer].generate(), "Sealed");
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

    // Generate and zip the log file
    var textFile = "";
    for (var iLog in anrsealedLogs)
    {
      textFile += anrsealedLogs[iLog] + "\r\n";
    }
    zip.file("log.txt", textFile);

    // Generate and Zip the Players files
    for (var iPlayer = 0; iPlayer < this.mNbPlayers; iPlayer++) {
      var player = this.mPlayers[iPlayer];
      for (var locale of ["EN", "FR"])
      {
        for (var side in Side)
        {
          for (var iPack = 0; iPack < (this.mNbStarters + this.mNbBoosters); iPack++)
          {
            // Retrieve the Pack and its names
            var sealedPack = player.mSealedPacks[side][iPack];
            var sideName = side[0].toUpperCase() + side.substr(1).toLowerCase();
            var packName = ((this.mNbStarters > 0) && (iPack < this.mNbStarters)) ? ("Starter") : ("Booster " + (iPack - this.mNbStarters + 1));
            var fileName = "Sealed Pack - " + player.mName + " - " + sideName + " - " + packName + ".txt";
            var sortedByCardTypeFileName = "Sealed Pack - " + player.mName + " - Sorted by Card Type - " + locale + " - " + sideName + " - " + packName +".txt";
            var alphabeticalFileName = "Sealed Pack - " + player.mName + " - Sorted by Alphabetical order - " + locale + " - " + sideName + " - " + packName +".txt";
            var fullInformationFileName = "Sealed Pack - " + player.mName + " - All Information - " + locale + " - " + sideName + " - " + packName +".txt";
            var factionTypeFileName = "Sealed Pack - " + player.mName + " - Sorted by Faction then by Card Type - " + locale + " - " + sideName + " - " + packName +".txt";
            var cycleSetFileName = "Sealed Pack - " + player.mName + " - Sorted by Data Pack - " + locale + " - " + sideName + " - " + packName +".txt";

            // Generate the file sorted by card type
            var textFile = sealedPack.generateTextFileSortedByCardType(locale);
            // Add the Text File to the ZIP file
            var path = "Sorted by Card Type/" + locale + "/" + fileName;
            zip.file(path, textFile);
            zip.file("Sorted by Player/" + player.mName + "/" + path, textFile);

            // Generate the Sealed Pack File sorted Alphabetically
            var textFile = sealedPack.generateTextFileSortedByAlphabeticalOrder(locale);
            // Add the Text File to the ZIP file
            var path = "Sorted by Alphabetical order (Import into NetrunnerDB or Jinteki.net)/" + locale + "/" + fileName;
            zip.file(path, textFile);
            zip.file("Sorted by Player/" + player.mName + "/" + path, textFile);

            // Generate the full text Sealed Pack File
            var textFile = sealedPack.generateTextFileFull(locale);
            // Add the Text File to the ZIP file
            var path = "All Information/" + locale + "/" + fileName;
            zip.file(path, textFile);
            zip.file("Sorted by Player/" + player.mName + "/" + path, textFile);

            // Generate the Sealed Pack File sorted by Faction then by Card Type
            var textFile = sealedPack.generateTextFileSortedByFactionType(locale);
            // Add the Text File to the ZIP file
            var path = "Sorted by Faction then by Card Type/" + locale + "/" + fileName;
            zip.file(path, textFile);
            zip.file("Sorted by Player/" + player.mName + "/" + path, textFile);

            // Generate the Sealed Pack File sorted by Cycle then by Set
            var textFile = sealedPack.generateTextFileSortedByCycleSet(locale);
            // Add the Text File to the ZIP file
            var path = "Sorted by Data Pack/" + locale + "/" + fileName;
            zip.file(path, textFile);
            zip.file("Sorted by Player/" + player.mName + "/" + path, textFile);
          }
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

