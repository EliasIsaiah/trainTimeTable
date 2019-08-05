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

    let database = firebase.database();


    database.ref("trains").on("value", onSuccessFunc, onErrorFunc);

    function buildTableDOM(trainObject) {
        // $("tbody").empty();
        let $tr = $("<tr>");
        let $name = $("<td>");
        let $destination = $("<td>");
        let $frequency = $("<td>");
        let $nextArrival = $("<td>");

        $name.text(trainObject.trainName);
        $destination.text(trainObject.destination);
        $frequency.text(trainObject.frequency);
        $nextArrival.text(trainObject.arrivalTime);

        $tr.append($name, $destination, $frequency, $nextArrival);
        $("tbody").append($tr);
    }

    function onSuccessFunc(data) {

        let trains = data.val();

        try {
            let trainKeys = Object.keys(trains);

            trainKeys.forEach((key) => {
                buildTableDOM(trains[key]);
            })
        }
        catch (error) {
            console.log("error:");
            console.log(error);
        }

    }

    function onErrorFunc(error) {
        console.log("error:");
        console.log(error);
    }



    $("button.submitBtn").on("click", function (event) {

        if (trainNameInput.val() && destinationInput.val() && frequencyInput.val() && arrivalTimeInput.val()) {
            $("tbody").empty();
            database.ref("trains").push({
                trainName: trainNameInput.val(),
                destination: destinationInput.val(),
                frequency: frequencyInput.val(),
                arrivalTime: arrivalTimeInput.val()
            }, function (error) {
                console.log("error:");
                console.log(error);
            })
            event.preventDefault();
        }
    })

    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    })
})