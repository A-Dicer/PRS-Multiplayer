
  // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyANzhqEOMQe8qxdDzcgLXpxtPx7c8JbeKQ",
  //   authDomain: "prs-hype.firebaseapp.com",
  //   databaseURL: "https://prs-hype.firebaseio.com",
  //   projectId: "prs-hype",
  //   storageBucket: "prs-hype.appspot.com",
  //   messagingSenderId: "123897215130"
  // };
  // firebase.initializeApp(config);


  // var bigOne = $('#bigOne');
  // var dbRef = firebase.database().ref('user/00001/name'); 
  // dbRef.on('value', snap => bigOne.innerText = snap.val())
  // console.log(dbRef)

$(document).ready(function() {
  function fill(){
    $("#battleFieldLeft").fadeIn("slow");
    $(".fill").animate({ "right" : "10px" }, 1000);
    console.log("hello");
  }

fill();

});