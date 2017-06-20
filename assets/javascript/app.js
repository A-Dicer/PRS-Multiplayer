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
    // console.log(database);
  var connectionsRef = database.ref("/users");
  // console.log(connectionsRef)
  var connectedRef = database.ref(".info/connected");
  //watches for changes on users
  connectedRef.on("value", function(snap) {
    //if someone is on the site
    if (snap.val()) {
      var con = connectionsRef.push(true);
      //saves generated key as var
      game.key = con.key;
      //console log that key
      console.log(game.key)
      //if they disconnect remove the info
      con.onDisconnect().remove();
    }
  });
  //listens to see how many people are on site
  connectionsRef.on("value", function(snap) {
    console.log("number of people on site: " + snap.numChildren());
  });

   

  var game = {
    name: false,
    text: null,
    player: null,
    p1score: null,
    p2score: null,
    p1Picked: null,
    p2Picked: null,
    session: false,
    key: null,
    win: null,
    database: firebase.database(),

    start: function(){     
      $("h2").fadeIn("slow").html("Get Ready!");
      game.database.ref("/game").update({started: true,})
      
      console.log(game.session);
      setTimeout(game.round, 5000);
    },

    round: function(){
        $("h2").fadeOut("slow");
        
        if(game.player === 1){
          $("#picksLeft").fadeIn("slow");        
          $(".select").on("click", function(){
            var pick = $(this).attr("value")
            $("#choiceLeft").html("<img src='assets/images/" + pick + ".png' id='p1Choice'>" )
            game.database.ref("/game/p1").update({
              picked: pick,
            })
          $(".picks").fadeOut("slow");
          });
        }

        if(game.player === 2){
          $("#picksRight").fadeIn("slow");
          $(".select").on("click", function(){
            var pick = $(this).attr("value")
            game.database.ref("/game/p2").update({
              picked: pick,
            })
          $(".picks").fadeOut("slow");
          });

        }

        $(".select").hover(           
          //what happens when you hover the card
          function(){ 
            $(this).css({"border" : "solid #f00 2px", "box-shadow" : "1px 1px 10px #000"});
            $("h2").html($(this).attr("value"));
          },
          //what happens when you stop hovering the card
          function(){
            $(this).css({"border" : "solid #000 1px", "box-shadow" : "1px 1px 5px #000"});
            $("h2").html("");
          });

        $("span").fadeIn("slow");
        $("#CountDownTimer").TimeCircles().start();
        setTimeout(game.results, 5000);
      
    },

    results: function(){
      $("span").fadeOut("slow");
      $("#CountDownTimer").TimeCircles().destroy();
      $("#CountDownTimer").TimeCircles().rebuild();
      $(".select").fadeOut("slow");
      

      setTimeout( function(){
      $("#choiceLeft, #choiceRight").fadeIn("slow");
      $("#fillLeft").animate({"width" : "0%"}, 2500);
      $("#fillRight").animate({"right" : "-260px"}, 2000);
      }, 1000);

      database.ref("/game/").once("value", function(snap) {
        
        game.p1Picked = snap.val().p1.picked;
        game.p2Picked = snap.val().p2.picked;

        var p1Picked = game.p1Picked
        var p2Picked = game.p2Picked
        
        console.log("Player One " + p1Picked);
        console.log("Player Two " + p2Picked);

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
          console.log("First Check " + game.win)
        } 

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
          console.log("Second Check" + game.win)
        }

        else {console.log("NO PICKED ANYTHING!")}

        if (game.win === "p1"){
          var score = snap.val().p2.score ;
          game.database.ref("/game/p2/").update({ score:  score - 2});
        }
        if (game.win === "p2"){
          var score = snap.val().p1.score ;
          game.database.ref("/game/p1/").update({ score:  score - 2});
        }

        if (game.win === "tie"){
          var score = snap.val().p2.score ;
          game.database.ref("/game/p2/").update({ score:  score - 1});

          var score =  snap.val().p1.score ;
          game.database.ref("/game/p1/").update({ score:  score - 1});       
        }

        if(p2Picked === "null"){
          var score = snap.val().p2.score ;
          game.database.ref("/game/p2/").update({ score:  score - 3});
        }

        if(p1Picked === "null"){
          var score = snap.val().p1.score ;
          game.database.ref("/game/p1/").update({ score:  score - 3});
        }
        console.log("p1 score: " + game.p1score)
        console.log("p2 score: " + game.p2score)
      });

        if (game.p1score < 1 || game.p2score < 1){console.log("game over")}
        else { game.recap()};
    },

    recap: function(){
      var response;

      if (game.win !== "tie") {
        if (game.win === "p1"){response = game.p1Picked + " beats " + game.p2Picked}
        else {response = game.p2Picked + " beats " + game.p1Picked}
      }
      else { response = "You Tied"}

      $("h2").fadeIn("slow").text(response); 

      // game.database.ref("/game/p1/").update({picked: "null",})
      // game.database.ref("/game/p2/").update({picked: "null",})

    },

    reset: function(){
      
      game.database.ref("/game").update({
        playerCount: 0,
        started: false,
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
      
        game.session = false;
        game.name = false;
        game.player = null;
        console.log("reset")
    },
  }
 

  //listens to see if play button should be shown
  database.ref("/game").on("value", function(snap) {
    var players = snap.val().playerCount
    console.log("number of players " + players);

    $("#p1Name").html(snap.val().p1.name);
    $("#p2Name").html(snap.val().p2.name);

    game.p1score = snap.val().p1.score;
    game.p2score = snap.val().p2.score;

       // })

    $("#p1score").animate({"width" : game.p1score * 10 + "%"})
    $("#p2score").animate({"width" : 100 - (game.p2score * 10)  + "%"})



    if(snap.val().p1.picked !== "null"){
      $("#choiceLeft").html("<img src='assets/images/" + snap.val().p1.picked + ".png' id='p1Choice'>" )
    } else {
      $("#choiceLeft").html("");
    }

    if(snap.val().p2.picked !== "null"){
    $("#choiceRight").html("<img src='assets/images/" + snap.val().p2.picked + ".png' id='p2Choice'>" )
    } else {
      $("#choice").html("");
    }

    if(!game.name){if (!snap.val().started){$("#form").fadeIn("slow")}}

    if(snap.val().p1.picked !== "null"){
      $("#battleFieldLeft").fadeIn("slow");
      $("#fillLeft").animate({"width" : "85%"}, 1000);
    }

    if(snap.val().p2.picked !== "null"){
      $("#battleFieldRight").fadeIn("slow");
      $("#fillRight").animate({"right" : "-130px", "border" : "solid #000 2px"}, 1000);
    } 

    if (!game.session){
      if (players === 2) {
        game.session = true;
        setTimeout(game.start, 3000);
      }  
    }


  })


  //button to play the game
  $("#play-game").on("click", function(event) {
    event.preventDefault();
    
    //check to see the number of players
    database.ref("game").once("value", function(snap) {
    var players = snap.val().playerCount;
    console.log(players)
      //if there are no players you are player one
      if (players === 0){
        game.player = 1;
        game.name = $("#name-input").val().trim();
        database.ref("/game").update({playerCount: 1});
        database.ref("/game/p1").update({name: game.name, key: game.key})
      }
      
      //if there is one player you are player two
      if (players === 1){
        game.player = 2;
        game.name = $("#name-input").val().trim();
        database.ref("/game").update({playerCount: 2});
        database.ref("/game/p2").update({name: game.name, key: game.key})
      }
    });
    
    console.log

    $("#form").fadeOut("slow");
  })


  $("#reset").on("click", game.reset);

  

});

