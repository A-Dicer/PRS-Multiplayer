$(document).ready(function() {
  $("#CountDownTimer").TimeCircles();
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyANzhqEOMQe8qxdDzcgLXpxtPx7c8JbeKQ",
    authDomain: "prs-hype.firebaseapp.com",
    databaseURL: "https://prs-hype.firebaseio.com",
    projectId: "prs-hype",
    storageBucket: "prs-hype.appspot.com",
    messagingSenderId: "123897215130"
  };
  firebase.initializeApp(config);

 // Create a variable to reference the database.
  var database = firebase.database();
  var connectionsRef = database.ref("/users");
  var connectedRef = database.ref(".info/connected");
  //watches for changes on users
  connectedRef.on("value", function(snap) {
    //if someone is on the site
    if (snap.val()) {
      var con = connectionsRef.push(true);
      //saves generated key as var
      game.key = con.key;
      //if they disconnect remove the info
      con.onDisconnect().remove();
    }
  });
  //listens to see how many people are on site
  connectionsRef.on("value", function(snap) {
  $("#spectate").html("People on the site: " + snap.numChildren());
  });

  var game = {
    name: false,
    player: null,
    p1score: 10,
    p2score: 10,
    p1Picked: null,
    p2Picked: null,
    session: false,
    key: null,
    win: null,
    roundNumber: 1,
    database: firebase.database(),

    start: function(){ 
      console.log("Round: " + game.roundNumber)
      //sets items on page 
      $("h2").fadeOut("slow");
      $("#choiceLeft, #choiceRight").html("");   
      //opens "doors"
      setTimeout( function(){
        $("#fillLeft").animate({"width" : "30%"}, 1000);
        $("#fillRight").animate({"right" : "-260px"}, 1000);
      }, 500);
      //get ready to start
      setTimeout(function(){$("h5").fadeIn("slow").html("Get Ready!")}, 2000)
      setTimeout(game.round, 5000);
    },

    round: function(){
      $("h5").fadeOut("slow");
        //puts the picks on the screen for player one
        if(game.player === 1){
          $("#picksLeft").fadeIn("slow");
          //on click function to store the selection for player one        
          $(".select").on("click", function(){
            var pick = $(this).attr("value");
            $("#choiceLeft").html("<img src='assets/images/" + pick + ".png' id='p1Choice'>" )
            //update firebase
            game.database.ref("/game/p1").update({picked: pick,});
            $("#picksLeft").fadeOut("slow");
          });
        }
        //puts the picks on the screen for player two
        if(game.player === 2){
          $("#picksRight").fadeIn("slow");
          //on click function to store the selection for player two  
          $(".select").on("click", function(){
            var pick = $(this).attr("value");
            //update firebase
            game.database.ref("/game/p2").update({picked: pick,});
          $("#picksRight").fadeOut("slow");
          });
        }

        $(".select").hover(           
          //what happens when you hover
          function(){ 
            $(this).css({"border" : "solid #f00 2px", "box-shadow" : "1px 1px 10px #000"});
            $("h2").html($(this).attr("value"));
          },
          //what happens when you stop hovering
          function(){
            $(this).css({"border" : "solid #000 1px", "box-shadow" : "1px 1px 5px #000"});
            $("h2").html("");
          });

        $("span").fadeIn("slow");
        //starts the timer
        $("#CountDownTimer").TimeCircles().start();
        //after 5 seconds go get results
        setTimeout(game.results, 5000);  
    },

    results: function(){
      //puts itmes on page
      $("span").fadeOut("slow");
      $("#CountDownTimer").TimeCircles().destroy();
      $("#CountDownTimer").TimeCircles().rebuild();
      $("#picksLeft, #picksRight").fadeOut("slow");
      
      //grabs some info from the database once
      database.ref("/game/").once("value", function(snap) {
        game.p1Picked = snap.val().p1.picked;
        game.p2Picked = snap.val().p2.picked;
        game.p1score = snap.val().p1.score;
        game.p2score = snap.val().p2.score;
      });
     
        var p1Picked = game.p1Picked
        var p2Picked = game.p2Picked

        //set game.win back to null every time
        game.win = null;

        //check to see if player one made a choice
        if( p1Picked !== "null"){
          if( p1Picked === p2Picked){game.win = "tie"}
          else if ( p1Picked === "paper") {
            if (p2Picked === "rock"){game.win = "p1" }
            else if (p2Picked === "scissors"){game.win = "p2";}
          }
          else if ( p1Picked === "rock") {
            if (p2Picked === "scissors"){game.win = "p1" }
            else if (p2Picked === "paper"){game.win = "p2"}
          }
          else if ( p1Picked === "scissors") {
            if (p2Picked === "paper"){game.win = "p1" }
            else if (p2Picked === "rock"){game.win = "p2";}
          }
        } 
        //if player one didn't make a choice do this
        else if (p2Picked !== "null"){
          if( p1Picked === p2Picked){game.win = "tie"}
          else if ( p2Picked === "paper") {
            if (p1Picked === "rock"){game.win = "p2" }
            else if (p1Picked === "scissors"){game.win = "p1";}
          }
          else if ( p2Picked === "rock") {
            if (p2Picked === "scissors"){game.win = "p2" }
            else if(p1Picked === "paper"){game.win = "p1"}
          }
          else if ( p2Picked === "scissors") {
            if (p2Picked === "paper"){game.win = "p2" }
            else if(p1Picked === "rock"){game.win = "p1";}
          }
        }
        //in no one made a choice... what a bunch of jerks
        else {console.log("NOBODY PICKED ANYTHING!")}

        //time to caculate the points
        //I'm sure this could be done better
        if (game.win === "p1"){
          game.p2score = game.p2score - 2;
        }
        if (game.win === "p2"){
          game.p1score = game.p1score - 2;
        }

        if (game.win === "tie"){
          game.p2score = game.p2score - 1;
          game.p1score = game.p1score - 1;       
        }

        if(p2Picked === "null"){
          game.p2score = game.p2score - 3;
        }

        if(p1Picked === "null"){
          game.p1score = game.p1score - 3;  
        }

       //console log what they picked
        console.log("Player One: " + game.p1score + "pts - " + p1Picked);
        console.log("Player Two: " + game.p2score + "pts - " + p2Picked);
      game.recap();
    },

    recap: function(){
      var response;
      var loser;
      //build the response 
      if (game.p1Picked === "null" && game.p2Picked === "null"){
        response = "Hey, Nobody Picked Anything!";
      }
      else if (game.p1Picked === "null"){response = "Player One Didn't Pick!"}
      else if (game.p2Picked === "null"){response = "Player Two Didn't Pick!"}
      else if (game.win !== "tie") {
        if (game.win === "p1"){
          response = game.p1Picked + " beats " + game.p2Picked;
          loser = "p2";
        } else {
          response = game.p2Picked + " beats " + game.p1Picked;
          loser = "p1";
        }
      }
      else { response = "You Tied"};
      //show the the results of the round
      setTimeout( function(){
      $("#choiceLeft, #choiceRight").css({"display" : "block"});
      }, 500);

      setTimeout( function(){
      $("#fillLeft").animate({"width" : "30%"}, 1000);
      $("#fillRight").animate({"right" : "-260px"}, 1000);
      $("h2").fadeIn("slow").text(response).css('textTransform', 'capitalize');  
      }, 1500)

      setTimeout( function(){
        $("#choiceLeft, #choiceRight, h2").fadeOut("slow");
        //update firebase   
        game.database.ref("/game/p1/").update({ score:  game.p1score}); 
        game.database.ref("/game/p2/").update({ score:  game.p2score});
        game.database.ref("/game/p1/").update({ picked:  "null"}); 
        game.database.ref("/game/p2/").update({ picked:  "null"});      
      }, 5500);
      
      //check to see if someone lost    
      if (game.p1score < 1 || game.p2score < 1){ 
        setTimeout(function(){
          console.log("----------")
          game.roundNumber++
          game.end(), 7000});
      } else {
        setTimeout(game.start, 7000);
      }     
    },

    end: function(){
      var result;
      //build the result
      database.ref("/game/").once("value", function(snap) {     
        if (game.p1score === game.p2score) {result = "You Both Lose!"}
        else if (game.p1score > game.p2score ){result = snap.val().p1.name + " Wins!"}
        else {result = snap.val().p2.name + " Wins!"}
      });
      //desplay the result
      $("h2").fadeIn("slow").text(result);
      console.log("---------------------------");
      console.log(result);
      console.log("");

      setTimeout(game.reset, 5000);
    },

    reset: function(){

      //reset firebase values
      game.database.ref("/game").update({
        started: false,
        playerCount: 0,
      })

      game.database.ref("/game/p1").update({
        key: "null",
        name: "Waiting On Player",
        picked: "null",
        score: "10",
      })

      game.database.ref("/game/p2").update({
        key: "null",
        name: "Waiting On Player",
        picked: "null",
        score: "10",
      })

    game.name = false;
    game.player = null;
    game.p1score = 10;
    game.p2score = 10;
    game.p1Picked = null;
    game.p2Picked = null;
    game.session = false;
    game.key = null;
    game.win = null;
    game.roundNumber = 1;

    $("h2").fadeOut("slow");
    $("#form").fadeIn("slow");
    //reload page 
    // location.reload()
    },
  }

  //listens to see if play button should be shown
  database.ref("/game/").on("value", function(snap) {
    var players = snap.val().playerCount

    //listen for name and score changes on page
    $("#p1Name").html(snap.val().p1.name + " - " + snap.val().p1.score + "pts");
    $("#p2Name").html(snap.val().p2.name + " - " + snap.val().p2.score + "pts");

    //calculate the % of each player and animate it when it changes
    $("#p1score").animate({"width" : game.p1score * 10 + "%"})
    $("#p2score").animate({"width" : 100 - (game.p2score * 10)  + "%"})

    //listen for player ones pick.  place image of that pick on page.
    if(snap.val().p1.picked !== "null"){
      $("#choiceLeft").html("<img src='assets/images/" + snap.val().p1.picked + ".png' id='p1Choice'>" )
    }
    //listen for player twos pick.  place image of that pick on page.
    if(snap.val().p2.picked !== "null"){
    $("#choiceRight").html("<img src='assets/images/" + snap.val().p2.picked + ".png' id='p2Choice'>" )
    } 

    //if the the user hasn't put a name in and the game hasn't started show form
    if(!game.name){if (!snap.val().started){$("#form").fadeIn("slow")}}

    //when score changes for player one animate the change
    if(snap.val().p1.picked !== "null"){
      $("#fillLeft").animate({"width" : "85%"}, 1000);
    }
    //when score changes for player two animate the change
    if(snap.val().p2.picked !== "null"){
      $("#fillRight").animate({"right" : "-130px"}, 1000);
    } 

    //checks to see if the user has entered the game
    if (!game.session){
      //checks to see if there are two players... if so starts the game.
      if (players === 2) {
        game.session = true;
        //update firbase with game state
        game.database.ref("/game").update({started: true,})
        $("#form").fadeOut("slow")
        setTimeout(function(){ 
        console.log(snap.val().p1.name + " -vs- " + snap.val().p2.name)
        console.log("---------------------------")
        game.start(), 3000});
      }  
    }
  })

  //button to play the game
  $("#play-game").on("click", function(event) {
    event.preventDefault();
    
    if($("#name-input").val().trim() !== ""){
      
      //check to see the number of players
      database.ref("game").once("value", function(snap) {
      var players = snap.val().playerCount;
        //if there are no players you are player one
        if (players === 0){
          game.player = 1;
          game.name = $("#name-input").val().trim();
          //update firebase
          database.ref("/game").update({playerCount: 1});
          database.ref("/game/p1").update({name: game.name, key: game.key})
        }
        
        //if there is one player you are player two
        if (players === 1){
          game.player = 2;
          game.name = $("#name-input").val().trim();
          //update firebase
          database.ref("/game/p2").update({name: game.name, key: game.key})
          database.ref("/game").update({playerCount: 2});    
        }
      }) 
    };
    //remove form
    $("#form").fadeOut("slow");
  })  

});