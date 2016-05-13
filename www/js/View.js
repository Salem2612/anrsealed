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
    this.requestJSON('json/' + json + '_v' + this.mVersion + '.json', this.mJSONs, json, this.onFileLoaded, this);
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

    // Retrieve the number of cards from the view
    var nbCards = $('#radio_nb_cards_60').is(':checked') ? 60 :
                  $('#radio_nb_cards_80').is(':checked') ? 80 : 0;

    // Retrieve the ownership from the view
    var useOneCardPool = $('#radio_ownership_one').is(':checked');

    // Retrieve the cardpool choice from the view
    var useAllCards = $('#radio_cardpool_all').is(':checked');

    // Retrieve the available sets of the view
    var nbCoreSets =  $('#radio_nb_core_set_0').is(':checked') ? 0 :
                      $('#radio_nb_core_set_1').is(':checked') ? 1 :
                      $('#radio_nb_core_set_2').is(':checked') ? 2 :
                      $('#radio_nb_core_set_3').is(':checked') ? 3 : 0;
    var sets = [
      {"cycleNo" : 1,   "setNo" : 1, "nbSets" : nbCoreSets},
      {"cycleNo" : 2,   "setNo" : 1, "nbSets" : $('#checkbox_what_lies_ahead').is(':checked') ? 1 : 0},
      {"cycleNo" : 2,   "setNo" : 2, "nbSets" : $('#checkbox_trace_amount').is(':checked') ? 1 : 0},
      {"cycleNo" : 2,   "setNo" : 3, "nbSets" : $('#checkbox_cyber_exodus').is(':checked') ? 1 : 0},
      {"cycleNo" : 2,   "setNo" : 4, "nbSets" : $('#checkbox_a_study_in_static').is(':checked') ? 1 : 0},
      {"cycleNo" : 2,   "setNo" : 5, "nbSets" : $('#checkbox_humanitys_shadow').is(':checked') ? 1 : 0},
      {"cycleNo" : 2,   "setNo" : 6, "nbSets" : $('#checkbox_future_proof').is(':checked') ? 1 : 0},
      {"cycleNo" : 3,   "setNo" : 1, "nbSets" : $('#checkbox_creation_and_control').is(':checked') ? 1 : 0},
      {"cycleNo" : 4,   "setNo" : 1, "nbSets" : $('#checkbox_opening_move').is(':checked') ? 1 : 0},
      {"cycleNo" : 4,   "setNo" : 2, "nbSets" : $('#checkbox_second_though').is(':checked') ? 1 : 0},
      {"cycleNo" : 4,   "setNo" : 3, "nbSets" : $('#checkbox_mala_tempora').is(':checked') ? 1 : 0},
      {"cycleNo" : 4,   "setNo" : 4, "nbSets" : $('#checkbox_true_colors').is(':checked') ? 1 : 0},
      {"cycleNo" : 4,   "setNo" : 5, "nbSets" : $('#checkbox_fear_and_loathing').is(':checked') ? 1 : 0},
      {"cycleNo" : 4,   "setNo" : 6, "nbSets" : $('#checkbox_double_time').is(':checked') ? 1 : 0},
      {"cycleNo" : 5,   "setNo" : 1, "nbSets" : $('#checkbox_honor_and_profit').is(':checked') ? 1 : 0},
      {"cycleNo" : 6,   "setNo" : 1, "nbSets" : $('#checkbox_upstalk').is(':checked') ? 1 : 0},
      {"cycleNo" : 6,   "setNo" : 2, "nbSets" : $('#checkbox_the_spaces_between').is(':checked') ? 1 : 0},
      {"cycleNo" : 6,   "setNo" : 3, "nbSets" : $('#checkbox_first_contact').is(':checked') ? 1 : 0},
      {"cycleNo" : 6,   "setNo" : 4, "nbSets" : $('#checkbox_up_and_over').is(':checked') ? 1 : 0},
      {"cycleNo" : 6,   "setNo" : 5, "nbSets" : $('#checkbox_all_that_remains').is(':checked') ? 1 : 0},
      {"cycleNo" : 6,   "setNo" : 6, "nbSets" : $('#checkbox_the_source').is(':checked') ? 1 : 0},
      {"cycleNo" : 7,   "setNo" : 1, "nbSets" : $('#checkbox_order_and_chaos').is(':checked') ? 1 : 0},
      {"cycleNo" : 8,   "setNo" : 1, "nbSets" : $('#checkbox_the_valley').is(':checked') ? 1 : 0},
      {"cycleNo" : 8,   "setNo" : 2, "nbSets" : $('#checkbox_breaker_bay').is(':checked') ? 1 : 0},
      {"cycleNo" : 8,   "setNo" : 3, "nbSets" : $('#checkbox_chrome_city').is(':checked') ? 1 : 0},
      {"cycleNo" : 8,   "setNo" : 4, "nbSets" : $('#checkbox_the_underway').is(':checked') ? 1 : 0},
      {"cycleNo" : 8,   "setNo" : 5, "nbSets" : $('#checkbox_old_hollywood').is(':checked') ? 1 : 0},
      {"cycleNo" : 8,   "setNo" : 6, "nbSets" : $('#checkbox_the_universe_of_tomorrow').is(':checked') ? 1 : 0},
      {"cycleNo" : 9,   "setNo" : 1, "nbSets" : $('#checkbox_data_and_destiny').is(':checked') ? 1 : 0},
      {"cycleNo" : 10,  "setNo" : 1, "nbSets" : $('#checkbox_khala_ghoda').is(':checked') ? 1 : 0},
      {"cycleNo" : 10,  "setNo" : 2, "nbSets" : $('#checkbox_business_first').is(':checked') ? 1 : 0},
      {"cycleNo" : 10,  "setNo" : 3, "nbSets" : $('#checkbox_democracy_and_dogma').is(':checked') ? 1 : 0},
      {"cycleNo" : 10,  "setNo" : 4, "nbSets" : $('#checkbox_salsette_island').is(':checked') ? 1 : 0},
      {"cycleNo" : 10,  "setNo" : 5, "nbSets" : $('#checkbox_the_liberated_mind').is(':checked') ? 1 : 0},
      {"cycleNo" : 10,  "setNo" : 6, "nbSets" : $('#checkbox_fear_the_masses').is(':checked') ? 1 : 0}
    ];

    // Create the CardPools of each Side from the available sets
    var cardPools = {};
    for (var side in Side) {
      cardPools[side] = new CardPool(side, sets, useAllCards, this.mJSONs.constraints[nbCards], this.mDatabase);
    }

    // GENERATE THE SEALED
    this.mSealed = new Sealed(nbPlayers, cardPools, useOneCardPool, this.mVersion);
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
        var sealedPack = player.mSealedPacks[side];
        var text = "";
        // Print Current Pack
        var packStatus = (true === sealedPack.mConstraints.areMet()) ? ProcessingStatus.OK : ProcessingStatus.KO;
        if (packStatus === ProcessingStatus.KO) {
          text += " - [Player " + (iPlayer+1) +"] [" + side + "] : " + packStatus + "\n";
          for (var iConstraint = 0; iConstraint < sealedPack.mConstraints.mItems.length; iConstraint++) {
            // Print Current Constraint
            var constraint = sealedPack.mConstraints.mItems[iConstraint];
            if (!constraint.isMet()) {
              text += "    - Only " + constraint.mNbCurrent + " " + constraint.mType + " available. At least " + constraint.mNbMin + " needed.\n";
            }
          }
        }
        $('#textarea_status').val($('#textarea_status').val() + text);
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
