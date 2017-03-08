console.log('Player.js loaded');

/**
  * Class Player
  *
  * Manage the cards of a Player
  */
function Player(id, cardPools, nbStarters, nbBoosters) {

  // CONSTRUCTOR
  this.mId          = id;             // ID of the player (number starting at 1)
	this.mName        = "Player " + id; // Name of the Player : "Player ID"
  this.mCardPools   = cardPools;      // Pool of available cards
  this.mNbStarters  = nbStarters;     // Number of Starters
  this.mNbBoosters  = nbBoosters;     // Number of Boosters
  this.mSealedPacks = {};             // Array of Sealed Packs

}//end Player

Player.prototype = {

  /**
    * Geenrate the Sealed Pools of the Player
    */
  generate : function() {
    var processingStatus = new ProcessingStatus();
    // Generate the SealedPack of each Side
    for (var side in Side) {
      this.mSealedPacks[side] = [];
      for (var iPack = 0; iPack < (this.mNbStarters + this.mNbBoosters); iPack++) {
        anrsealedLogs.push("[" + this.mName + "." + side + "]");
        // Generate the current Pack with the current CardPool
        var sealedPack = new Pack(this.mCardPools[side], ((this.mNbStarters > 0) && (iPack < this.mNbStarters)) ? 'STARTER' : 'BOOSTER');
        processingStatus.process(sealedPack.generate(), "Player");
        this.mSealedPacks[side][iPack] = sealedPack;
      }
    }
    return processingStatus.mValue;
  },

  /**
    * Get the number of copies of cards for the given side
    *
    * return  Number of copies of cards
    */
  getNbCards : function(side) {
    var packs = this.mSealedPacks[side];
    var nbCards = 0;
    for (var iSealedPack = 0; iSealedPack < packs.length; iSealedPack++) {
      nbCards += packs[iSealedPack].mCards.getNbCards();
    }
    return nbCards;
  }

};
