
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDNDkKdr7DFYQfOXTR3fGlQ25OOAcqCkjY",
    authDomain: "train-schedule-bonus.firebaseapp.com",
    databaseURL: "https://train-schedule-bonus.firebaseio.com",
    projectId: "train-schedule-bonus",
    storageBucket: "",
    messagingSenderId: "323684644740"
  };
  firebase.initializeApp(config);

//variable to reference the database.
var database = firebase.database();

//initial variables
// var name;
// var destination;
// var firstArrival;
// var frequency;
console.log("JS Connected")

// input validation
function validate(name, destination, firstArrival, frequency) {;
    console.log(!name && !destination && !firstArrival && !frequency)
    return !!name && !!destination && !!firstArrival && !!frequency;
}


//update train scedule
function updateShedule(childSnapshot) {

    var ohSnap = childSnapshot.val()
    var name = childSnapshot.val().name
    var destination = childSnapshot.val().destination
    var firstArrival = childSnapshot.val().firstArrival
    var frequency = childSnapshot.val().frequency

    console.log(ohSnap.name)
    console.log(ohSnap)




    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstArrivalConverted = moment(firstArrival, "HH:mm").subtract(1, "years");
    console.log(firstArrivalConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstArrivalConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



    var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(tMinutesTillTrain)
    )
    $("#trains-here").append(newRow);

    $("#current-time").text("CURRENT TIME: " + moment(currentTime).format("hh:mm A"))
}


//on click event add train
$("#add-train").on("click", function (event) {
    event.preventDefault();
    
    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstArrival = $("#arrival-input").val().trim()
    var frequency = $("#frequency-input").val().trim();

    console.log(!validate(name, destination, firstArrival, frequency)) // ! "bang" makes it opposit true/false
    if (!validate(name, destination, firstArrival, frequency)) {
          $('#Modal').modal();
        return;    
    }else {
        database.ref().push({
            name: name,
            destination: destination,
            firstArrival: firstArrival,
            frequency: frequency
        })

        $("#name-input").val('');
        $("#destination-input").val('');
        $("#arrival-input").val('');
        $("#frequency-input").val('');
    }
})

database.ref().on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    // console.log("========================================================= start")
    // console.log(childSnapshot.val().name);
    // console.log(childSnapshot.val().destination);
    // console.log(childSnapshot.val().firstArrival);
    // console.log(childSnapshot.val().frequency);
    // console.log("========================================================= End")
    
    // var ohSnap = childSnapshot.val()
    // var name = childSnapshot.val().name
    // var destination = childSnapshot.val().destination
    // var firstArrival = childSnapshot.val().firstArrival
    // var frequency = childSnapshot.val().frequency

    updateShedule(childSnapshot)

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


// Closes Modal Alert
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })

  //refresh
  $("#refresh-train").on("click", function(event) {
    event.preventDefault();
    let childSnapshot = database.ref();
    updateShedule(childSnapshot)
   
  })