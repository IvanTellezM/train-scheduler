 // Initialize Firebase
 var config = {
     apiKey: "AIzaSyAu42ai1gt9MtgJkf7FDI_-DPI2h8vVFKY",
     authDomain: "trainschedule-2cf3d.firebaseapp.com",
     databaseURL: "https://trainschedule-2cf3d.firebaseio.com",
     projectId: "trainschedule-2cf3d",
     storageBucket: "",
     messagingSenderId: "117430520302"
 };
 firebase.initializeApp(config);


 var database = firebase.database();

 // Create Firebase event for adding train to the database and a row in the html when a user adds an entry
 database.ref().on("child_added", function(childSnapshot, prevChildKey) {

     // Store everything into a variables
     var trainName = childSnapshot.val().name;
     var trainDest = childSnapshot.val().dest;
     var trainFirst = childSnapshot.val().first;
     var trainFreq = childSnapshot.val().freq;

     //train math
     // Assumptions
     var tFrequency = trainFreq;
     var firstTime = trainFirst;
     // First Time (pushed back 1 year to make sure it comes before current time)
     var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
     console.log(firstTimeConverted);
     // Current Time
     var currentTime = moment();
     console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
     // Difference between the times
     var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
     console.log("DIFFERENCE IN TIME: " + diffTime);
     // Time apart (remainder)
     var tRemainder = diffTime % tFrequency;
     console.log(tRemainder);
     // Minute Until Train
     var minAway = tFrequency - tRemainder;
     console.log("MINUTES TILL TRAIN: " + minAway);
     // Next Train
     var trainNext = moment().add(minAway, "minutes").format("h:mm A");
     console.log("ARRIVAL TIME: " + trainNext);

     // Add each train's data into the table
     $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq +
         "</td><td>" + trainNext + "</td><td>" + minAway + "</td></tr>");
 }, function(errorObject) {
     console.log("Error: " + errorObject.code)
 });

 // Button for adding trains
 $("#add-train-btn").on("click", function(event) {
     event.preventDefault();

     // Grabs user input
     var trainName = $("#train-name-input").val().trim();
     var trainDest = $("#dest-input").val().trim();
     var trainFirst = $("#first-train-input").val().trim();
     var trainFreq = $("#freq-input").val().trim();

     // Creates local "temporary" object for holding train data
     var newTrain = {
         name: trainName,
         dest: trainDest,
         first: trainFirst,
         freq: trainFreq,
     };

     // Uploads train data to the database
     database.ref().push(newTrain);

     // Log successful
     console.log("Train successfully added");

     // Clears all of the text-boxes
     $("#train-name-input").val("");
     $("#dest-input").val("");
     $("#first-train-input").val("");
     $("#freq-input").val("");
 });