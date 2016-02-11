console.log('View.js loaded');

/**
  * Class View
  *
  * Treatments on the view.
  */
function View(jsons, version) {

  // CONSTRUCTOR
  // Initialize members
  this.mNbJSONsLoaded = 0;
  this.mDatabase = {};
  this.mSealed = {};
  this.mVersion = version;
  this.mJSONs = {nbFiles:jsons.length};
  for (var json of jsons) {
    // Request the JSON file asynchronously
    this.requestJSON('json/' + json + '.json', this.mJSONs, json, this.onFileLoaded, this);
  }

}//end View


View.prototype = {

  /**
    * Callback to call in requestJSON when a JSON file have been loaded
    *
    * return  void
    */
  onFileLoaded : function() {
    // Increment the number of JSON Files loaded
    this.mNbJSONsLoaded++;
    // Check if all files have been loaded
    if (this.mNbJSONsLoaded == this.mJSONs.nbFiles) {
      // All JSON Files have benn loaded

      // Create the Database
      this.mDatabase = new Database(this.mJSONs);

      // Render the Starters and Boosters on the View
      var starters = [];
      var boosters = [];
      for (var iCardPool = 0; iCardPool < this.mJSONs.cardpools.length; iCardPool++) {
        var cardPoolJSON = this.mJSONs.cardpools[iCardPool];
        // Add the {{imagePath}} attribut
        cardPoolJSON.imagePath = "images/" + cardPoolJSON.edition.split(' ').join('_').toLowerCase() + "_" + cardPoolJSON.type.toLowerCase() + ".jpg";
        // Add the {{index}} attribut
        cardPoolJSON.index = iCardPool;
        // Add the {{width}} attribut
        switch (cardPoolJSON.type) {
          case CardPool.TYPE.STARTER :
            cardPoolJSON.width = "col-xs-12";
            starters.push(cardPoolJSON);
            break;
          case CardPool.TYPE.BOOSTER :
            cardPoolJSON.width = "col-lg-3 col-md-4 col-sm-3 col-xs-4";
            boosters.push(cardPoolJSON);
            break;
        }
      }
      // Render the Starters
      this.renderTemplate(starters, '#tmpl_pack', '#div_starters');
      // Render the Boosters
      this.renderTemplate(boosters, '#tmpl_pack', '#div_boosters');
      // Set the text inputs selectable
      $('input[type="text"]').on('click', function(e) {
        this.select();
      });
    }
  },

  /**
    * Request asynchronously a JSON file specified by its URL. The treatment is performed in the
    * Store the Configuration of a Sealed Game
    *
    * databaseUrl : URL of the database file
    * obj : Object where to find a field specified by fieldString
    * fieldString : String of a field in obj to store the resulted JSON data
    * callback : Function to call after request (Optional)
    *
    * return  void
    */
    requestJSON : function(databaseUrl, obj, fieldString, callback, view){
    // Request the Data Base from the given file path. The request is done asynchronously.
    $.ajax({
      url: databaseUrl,
      beforeSend: function(xhr){
        if (xhr.overrideMimeType)
        {
          xhr.overrideMimeType("application/json");
        }
      },
      async:true,
      global: false,
      dataType: 'json',
      data:fieldString,
      success: function(data, status, request) {
        obj[fieldString] = data;
        callback.call(view);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
      }
    });
  },

  /**
    * Generate then Download the Sealed Packs.
    *
    *
    * return  void
    */
  generateAndDownloadSealed : function() {
    // Generate the Sealed
    var generateStatus = this.generateSealed();
    if (ProcessingStatus.OK == generateStatus) {
      // Download the Sealed
      var downloadStatus = this.downloadSealed();
    }
  },

  /**
    * Generate the Sealed Packs of all players.
    *
    *
    * return
    */
  generateSealed : function() {
    var processingStatus = new ProcessingStatus();

    // Retrieve the number of players from the view
    var nbPlayers = parseInt($('#text_nb_players').val());
    processingStatus.checkNbPlayers(nbPlayers);

    // Create the CardPools of each Side
    var cardPoolsJSON = this.mJSONs.cardpools;
    var sidesCardPools = {};
    for (var side in Side) {
      sidesCardPools[side] = [];
      var cardPools = sidesCardPools[side];
      // Create the CardPools of the current Side
      for (var iCardPool = 0; iCardPool < cardPoolsJSON.length; iCardPool++)
      {
        // Retrieve the current CardPool from the JSON file
        var cardPoolJSON = cardPoolsJSON[iCardPool];
        // Retrieve the Number of Copies of Packs from the view
        var nbPacks = parseInt($('#text_cardpool_'+iCardPool+'_nb_packs').val());
        // Create the current CardPool Object
        var cardPool = new CardPool(side, nbPacks, cardPoolJSON.nbCardCopies, cardPoolJSON, this.mDatabase);
        // Add the current CardPool to the Array of CardPools
        cardPools.push(cardPool);
      }
    }

    // GENERATE THE SEALED
    this.mSealed = new Sealed(nbPlayers, sidesCardPools, this.mVersion);
    processingStatus.process(this.mSealed.generate());

    // PRINT STATUS
    this.printStatus(processingStatus);

    return processingStatus.mValue;
  },

  printStatus : function(processingStatus) {
    // Print Date and Time
    var date = new Date();
    $('#textarea_status').val("[" + date.toLocaleDateString() + " " + date.toLocaleTimeString() + "]\n");

    // Print Global Status
    if (ProcessingStatus.OK === processingStatus.mValue) {
      $('#textarea_status').val($('#textarea_status').val() + "Generating finished : " + processingStatus.mValue);
    }
    else
    {
      $('#textarea_status').val($('#textarea_status').val() + "Generating finished : " + processingStatus.mValue + "\n> ERROR : " + processingStatus.mDetail + "\n\n");
    }

    // Print Status of each Constraint of each Pack of each Sealed Pool of each Player
    for (var iPlayer = 0; iPlayer < this.mSealed.mNbPlayers; iPlayer++) {
      // Print Current Player
      var player = this.mSealed.mPlayers[iPlayer];
      for (var side in Side) {
        // Print Current Sealed Pool
        var sealedPool = player.mSealedPools[side];
        for (var iPack = 0; iPack < sealedPool.length; iPack++) {
          var text = "";
          // Print Current Pack
          var pack = sealedPool[iPack];
          var packStatus = (true === pack.mConstraints.areMet()) ? ProcessingStatus.OK : ProcessingStatus.KO;
          if (packStatus === ProcessingStatus.KO) {
            text += " - [Player " + (iPlayer+1) +"] [" + side + "] [" + pack.mName + "] : " + packStatus + "\n";
            for (var iConstraint = 0; iConstraint < pack.mConstraints.mItems.length; iConstraint++) {
              // Print Current Constraint
              var constraint = pack.mConstraints.mItems[iConstraint];
              if (!constraint.isMet()) {
                text += "    - " + constraint.mNbCurrent + " " + constraint.mType + " is out of range [" + constraint.mNbMin + ";" + constraint.mNbMax + "]\n";
              }
            }
          }
          $('#textarea_status').val($('#textarea_status').val() + text);
        }
      }
    }
  },

  /**
    * Download the Sealed Packs from the View.
    *
    *
    * return  void
    */
  downloadSealed : function() {
    // Download the Sealed
    this.mSealed.download();
  },

  /**
    * Render the specified elements with the specified template into HTML in the specified HTML target.
    *
    * return  void
    */
  renderTemplate : function(elementsToRender, templateIdentifier, targetIdentifier) {
    // Load the template
    var template = $(templateIdentifier).html();
    // Parse the template
    Mustache.parse(template);
    // Initialize the array that stores the renderings
    var renderings = [];
    // Render the elements one by one
    for(iRendering = 0; iRendering < elementsToRender.length; iRendering++) {
      // Render the current content
      renderings[iRendering] = Mustache.render(template, elementsToRender[iRendering]);
    }
    // Paste the HTML
    $(targetIdentifier).html(renderings);
  },

  /**
    * Check and Generate the Omnileague Reserve from the Checker window
    */
  checkAndGenerateReserve : function(){
    // Retrieve the Sealed Pack text
    var sealedPackText = $('#textarea_checker_sealed_pack').val();
    // Parse the Sealed Pack text and create a Sealed Pack array
    var sealedPackArray = this.parseCardList(sealedPackText);

    // Retrieve the Deck text
    var deckText = $('#textarea_checker_deck').val();
    // Parse the Deck text and create a Deck array
    var deckArray = this.parseCardList(deckText);

    // Create an empty Status array. It stores the cards that are in the Deck but not in the Sealed Pack
    var statusArray = [];

    // Browse the Deck array and check if each card is in the Sealed Pack array. If a card of the Deck is not in the Sealed Pack, add it into the Status array. Remove the card from the Sealed Pack array and add it to the Reserve array.
    for(iDeckCard = 0; iDeckCard < deckArray.length; iDeckCard++) {
      // Retrieve the current card of the deck
      var deckCard = deckArray[iDeckCard];

      // Search the card of the Deck in the Sealed Pack. Mark the cardFound flag to true when found.
      var cardFound = false;
      for(var iSealedPackCard = 0; iSealedPackCard < sealedPackArray.length; iSealedPackCard++) {
        // Retrieve the current card of the Sealed Pack
        var sealedPackCard = sealedPackArray[iSealedPackCard];
        // Compare the name of the deck card and sealed pack card
        if (deckCard.name == sealedPackCard.name) {
          // Card found !
          cardFound = true;
          iSealedPackCardFound = iSealedPackCard;
          break; // Stop searching to save the index of the Sealed Pack card that match the deck card
        }
      }

      // Check if the card has been found
      if (true === cardFound) {
        // Card found. The index of the Sealed Pack Card has been saved.
        var sealedPackCard = sealedPackArray[iSealedPackCardFound];
        // Compare the number of copies in the deck and the number of copies in the Sealed Pack
        if (deckCard.nb > sealedPackCard.nb) {
          // Too much copies of this card in the deck.
          // Add this card to the Status array
          var statusCard = {name:deckCard.name, nbInDeck:deckCard.nb, nbInSealedPack:sealedPackCard.nb};
          statusArray.push(statusCard);
        }
        else if (deckCard.nb == sealedPackCard.nb) {
          // The number of copies of this card are equal in the Deck and in the Sealed Pack.
          // Remove this card from the Sealed Pack
          sealedPackArray.splice(iSealedPackCardFound, 1);
        }
        else {
          // The number of copies in the deck is less than in the Sealed Pack.
          // Decrement the number of copies of this card in the Sealed Pack
          sealedPackCard.nb -= deckCard.nb;
        }
      }
      else {
        // Card not found.
        // Add this card to the Status array
        var statusCard = {name:deckCard.name, nbInDeck:deckCard.nb, nbInSealedPack:0};
        statusArray.push(statusCard);
      }
    }

    // Create the text of the Status from the Status array
    var statusText = this.createStatusText(statusArray);
    // Print the Status text
    $('#textarea_checker_status').val(statusText);

    // Create the text of the Reserve from the Reserve array (stored in the modified Sealed Pack array)
    if (0 == statusArray.length) {
      var reserveText = this.createCardList(sealedPackArray);
      // Print the text of the Reserve
      $('#textarea_checker_reserve').val(reserveText);
    }
  },

  parseCardList : function(cardList) {
    var cardArray = [];
    
    // Parse each line of text and add the cards into the array
    var re = /^(\d+)(x|\s)\s*(\S.*)/;
    var lines = cardList.split('\n');
    for(var iLine = 0; iLine < lines.length; iLine++){
      // Parse the current line
      var line = lines[iLine];
      var elems = line.match(re);
      if (elems != null) {
        var card = {nb : parseInt(elems[1], 10), name : elems[3]};
        cardArray.push(card);
      }
    }    
    return cardArray;
  },

  createCardList : function(cardArray) {
    var cardList = "";

    // Add each card into a line of Text
    for(var iCard = 0; iCard < cardArray.length; iCard++) {
      // Retrieve the current card from the array
      var card = cardArray[iCard];
      // Add the text
      cardList += card.nb + "x " + card.name + "\r\n";
    }
    return cardList;
  },

  createStatusText : function(statusArray) {
    var statusText = "";

    // The first line of text is the global status of the check (Success or Fail)
    if (statusArray.length == 0) {
      // Success
      statusText += "SUCCESS : The Deck is consistent with the Sealed Pack.";
    }
    else {
      // Fail
      statusText += "FAIL : The Deck is NOT consistent with the Sealed Pack.\r\n";
    }

    // Add each card of the Status Array into a line of Text in the Status Text
    for(var iCard = 0; iCard < statusArray.length; iCard++) {
      // Retrieve the current card from the Status array
      var card = statusArray[iCard];
      // Add the text
      statusText += " - " + card.name + " : " + card.nbInDeck + " in the Deck. " + card.nbInSealedPack + " avaible in the Sealed Pack.\r\n";
    }
    return statusText;
  }

};
