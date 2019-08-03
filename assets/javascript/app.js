$(document).ready(function () {


    const trainNameInput = $("#trainNameInput");
    const destinationInput = $("#destinationInput");
    const frequencyInput = $("#frequencyInput");
    const arrivalTimeInput = $("#arrivalTimeInput");

    var firebaseConfig = {
        apiKey: "AIzaSyC0Oe4tv19Y2QW7NtFT1I2Q3e9AEVQ04_w",
        authDomain: "train-time-table-3d650.firebaseapp.com",
        databaseURL: "https://train-time-table-3d650.firebaseio.com",
        projectId: "train-time-table-3d650",
        storageBucket: "train-time-table-3d650.appspot.com",
        messagingSenderId: "526363497036",
        appId: "1:526363497036:web:b7e405d012e9233b"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    console.log(database);

    $("button.submitBtn").on("click", function (event) {

        database.ref("/trains/").push({
            trainName: trainNameInput.val(),
            detination: destinationInput.val(),
            frequency: frequencyInput.val(),
            arrivalTime: arrivalTimeInput.val()
        })
        //this is what a comment looks like
        event.preventDefault();
        trainNameInput.val("");
        destinationInput.val("");
        frequencyInput.val("");
        arrivalTimeInput.val("");
    })

    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            // if ($("input.userInput").val()) {
            //     buildNewButtonDOM($("input.userInput").val());
            // } else
            //     return false;
            return false;
        }
    })
})