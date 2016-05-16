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
  this.mSealedPacks = {}; // Sealed Packs

}//end Player

Player.prototype = {

  /**
    * Geenrate the Sealed Pools of the Player
    */
  generate : function() {
    var processingStatus = new ProcessingStatus();
    // Generate the SealedPack of each Side
    for (var side in Side) {
      // Generate the current Pack with the current CardPool
      var sealedPack = new Pack(this.mCardPools[side]);
      processingStatus.process(sealedPack.generate());
      this.mSealedPacks[side] = sealedPack;
    }
    return processingStatus.mValue;
  }

};
