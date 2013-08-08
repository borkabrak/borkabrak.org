/* 
 * Card -- poker-style playing cards
 *
 */

Card = function (rank,suit) {

  this.rank = rank;
  this.suit = suit;

} 

Card.prototype.toHTML = function() {
  // Builds and returns an HTML element representing the card.

  // The Card container element
  var card = document.createElement("span");
  $(card).addClass("card");

  // Suit indicators
  var top_left_suit = document.createElement("span");
  $(top_left_suit).addClass("suit");
  $(bottom_right_suit).addClass("top_left");
  $(top_left_suit).html(this.suit);

  var bottom_right_suit = document.createElement("span");
  $(bottom_right_suit).addClass("suit");
  $(bottom_right_suit).addClass("bottom_right");
  $(bottom_right_suit).html(this.suit);

  // Rank insignia
  var rank = document.createElement("rank");
  $(rank).addClass("rank");
  $(rank).html(this.rank);

  card.appendChild(top_left_suit);
  card.appendChild(rank);
  card.appendChild(bottom_right_suit);

  return card;
}

/*
 * Deck -- more or less a collection of Cards
 *
 */

Deck = function(init_data){

  var data = init_data || {};

  this.ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

  this.suits = [
    "&spades;", //Spades
    "&hearts;", //Hearts
    "&diams;", //Diamonds -- for some reason, this is the *only* one abbreviated (grr..)
    "&clubs;"  //Clubs
  ];

  // container should be a css selector
  this.container = data.container || "";  

  // When displaying overlapping stacks of cards, 
  // how much of the lower card is displayed?
  this.overlap = data.overlap || "4";  

  //This is an array of Card objects
  this.cards = data.cards || [];

}

Deck.prototype.initialize = function(){

  this.cards = [];
  for (s in this.suits){
    for (r in this.ranks){
      this.push(new Card(this.ranks[r],this.suits[s]));
    }
  }

  return this;

};

Deck.prototype.push = function(card){
  return this.cards.push(card);
};

Deck.prototype.pop = function(){
  return this.cards.pop();
}

Deck.prototype.show = function(){
  // Update the status
  $("#" + this.container + " .status").html(
        //this.cards.length + " cards / " + 
        this.score?"Score: " + this.score:""
      );

  $("#" + this.container + " .show").html("");
  var len = this.cards.length;
  for (c in this.cards){
    var elem = this.cards[c].toHTML()
    elem.style.left = (c * this.overlap) + "em";
    $("#" + this.container + " .show").append(elem);
  }
  return this;
};

Deck.prototype.shuffle = function(){
  // Take a random card from the deck, swap it with the one on the end, 
  // then pop that off onto the new deck.  Stop when you've done 
  // every card.  The new deck then replaces the original.
  
  var oldstack = this.cards.slice(); // *copy* the array
  this.cards = []; 
  while(oldstack.length){

    // Swap random element with last element
    var r = Math.randomNumber(oldstack.length) - 1;
    var tmp = oldstack[r];
    oldstack[r] = oldstack[oldstack.length - 1];
    oldstack[oldstack.length - 1] = tmp;

    // Add that random element to the new stack
    this.push(oldstack.pop());
  }
  this.show()
  return this;
}

Deck.prototype.clear = function(){
  this.cards = [];
  this.score = 0;
  this.show();
  return this;
}

Deck.prototype.length = function(){
  return this.cards.length
}

// <- Deck

// Misc. functions -- these should probably go into a Game or Blackjack
// namespace at some point..

BlackJack = function(init) {
  //Blackjack - data is: a deck, a dealer, some number of players
  init = init || {
    playercount: 1
  };

  this.deck = new Deck(
                { 
                  container: "deck", 
                  overlap: 0.1 
                }
              ).initialize().shuffle();

  this.players = [];

  $("#players").html("");

  for(var current_player_index = 0; current_player_index <= init.playercount;current_player_index++){

    // The player's data..
    this.players[current_player_index] = new Deck({ container: "playerhand_" + current_player_index.toString()}).clear();

    // VISUAL ELEMENTS
    
    // The header..
    $("#players").append(
        // Player 0 is the dealer
        $(document.createElement("h3"))
        .append(current_player_index == 0?"Dealer":"Player " + current_player_index)
    );

    // The HTML container for everything else pertaining to this player
    var playerbox = $(document.createElement("div"))
    .attr("id","playerhand_" + current_player_index) 
    .addClass("cards")
    .html("Status:");

    // Readout of the player's status
    playerbox.append(
          $(document.createElement("span"))
          .addClass("status")
        );

    // The 'hit' button
    var hitbutton = $(document.createElement("button"))
      .html("Hit")
      .click(

        {
          player: current_player_index,
          thisgame: this
        },

        function(event){
          event.data.thisgame.hit(event.data.player);
        }

      );

    // The player's controls area
    playerbox.append(
      $(document.createElement("div"))
      .addClass("controls")
      .append(hitbutton)
    );

    playerbox.append(
      $(document.createElement("div"))
      .addClass("show")
    );

    $("#players").append(playerbox);

  }
}

BlackJack.prototype.checkScore = function(hand){
  var score = 0;
  var aces = 0;

  for (c in hand.cards){
    switch(hand.cards[c].rank){
      case "J": score += 10;break;
      case "Q": score += 10;break;
      case "K": score += 10;break;
      case "A": score += 11;
                aces++;
                break;
      default: score += parseInt(hand.cards[c].rank);
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;

}

BlackJack.prototype.hit = function(playernum){
  //playernum: index of which player gets a card

  var recipient = this.players[playernum] 

  if (this.deck.length() <= 0) {
    alert("The deck is empty.");
    return null;
  }

  var card = this.deck.pop();
  recipient.push(card);
  recipient.score = this.checkScore(recipient);
  recipient.show();
  this.deck.show();
  return card;

};

BlackJack.prototype.start = function() {

  // Initially, deal everybody two cards
  while (this.players[0].cards.length < 2) {
    for(i in this.players){
      this.hit(i);
    }
  }
  
}


/*
 * Things to do when the DOM is fully loaded
 *
 */

$(document).ready(function(){

  // Initialize the game
  var game = new BlackJack( { 
    playercount: 1
  } );

  // Build the player HTML -- this should be in the BlackJack object
  for (var current_player_index in game.players){


  }

  //..and then to global controls
  $("#button_newGame").click( function(){ 
      game = new BlackJack({ playercount: 1 }); 
  }); 

  $("#button_startgame").click( function(){ game.start() } );

});

