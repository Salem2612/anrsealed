console.log('Player.js loaded');

/**
  * Class Player
  *
  * Manage the cards of a Player
  */
function Player(name, cardPools, nbStarters, nbBoosters) {

  // CONSTRUCTOR
	this.mName        = name;       // Name of the Player
  this.mCardPools   = cardPools;  // Pool of available cards
  this.mNbStarters  = nbStarters; // Number of Starters
  this.mNbBoosters  = nbBoosters; // Number of Boosters
  this.mSealedPacks = {};         // Array of Sealed Packs

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
        // Generate the current Pack with the current CardPool
        var sealedPack = new Pack(this.mCardPools[side], ((this.mNbStarters > 0) && (iPack < this.mNbStarters)) ? 'STARTER' : 'BOOSTER');
        processingStatus.process(sealedPack.generate());
        this.mSealedPacks[side][iPack] = sealedPack;
      }
    }
    return processingStatus.mValue;
  }

};
