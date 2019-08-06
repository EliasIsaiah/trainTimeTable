$(document).ready(function () {


    const trainNameInput = $("#trainNameInput");
    const destinationInput = $("#destinationInput");
    const frequencyInput = $("#frequencyInput");
    const arrivalTimeInput = $("#arrivalTimeInput");

    const firebaseConfig = {
        apiKey: "AIzaSyC0Oe4tv19Y2QW7NtFT1I2Q3e9AEVQ04_w",
        authDomain: "train-time-table-3d650.firebaseapp.com",
        databaseURL: "https://train-time-table-3d650.firebaseio.com",
        projectId: "train-time-table-3d650",
        messagingSenderId: "526363497036",
        appId: "1:526363497036:web:b7e405d012e9233b"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    let time = {
        objectCurrentTime: moment(),

        getLastArrival: function(train){
            return train.arrivalTime;
        },

    }

    const database = firebase.database();

    function buildTableDOM(trainObject) {
        // $("tbody").empty();
        // let tableCells = ["trainName", "destination", "frequency", "minutesAway"];
        // tableCells.forEach((newCell) => {
        //     newCell = $("<td>");
        //     newCell.text(trainObject.cellData)
        // })
        let $tr = $("<tr>");
        let $name = $("<td>");
        let $destination = $("<td>");
        let $frequency = $("<td>");
        let $nextArrival = $("<td>");
        let $minutesAway = $("<td>");


        $name.text(trainObject.trainName);
        $destination.text(trainObject.destination);
        $frequency.text(trainObject.frequency);
        $nextArrival.text(calcNextArrival(trainObject.frequency, trainObject.arrivalTime));
        $minutesAway.text()

        $tr.append($name, $destination, $frequency, $nextArrival, $minutesAway);
        $("tbody").append($tr);
    }

    function calcNextArrival(frequency, firstArrival){
        console.log(moment());

        let mFirstArrival = moment.utc(firstArrival, "HH:mm");
        let currentTime = moment.utc(moment(), "HH:mm");
        console.log(mFirstArrival);
        console.log(currentTime);
        let diff = moment().diff(mFirstArrival);
        console.log(diff);
        //next arrival = (currentTime + (frequency - (currentTime - firstArrival) % frequency)))

        moment().subtract(firstArrival)

        return moment()
    }

    database.ref("trains").on("value", function (data) {
        if (data.val() === null) {
            $("tr.defaultText").show();
        } else {
            $("tr.defaultText").hide();
        }
    }, function (error) {
        $("tbody").html(`<tr><td>error: ${error}</td></tr>`);
    })

    // TODO:
    //use "on child_added" to reduce the amount of code required to implement the following part

    //TODO:
    //use firebase.database.SerValue.TIMESTAMP to store the date added for the record pushed in

    //TODO:
    //implement moment.js
    //hint: use moment().format("X")

    database.ref("trains").on("child_added", (data) => { buildTableDOM(data.val()) }, onErrorFunc);

    // function onSuccessFunc(data) {

    //     let trains = data.val();

    //     try {
    //         let trainKeys = Object.keys(trains);

    //         trainKeys.forEach((key) => {
    //             buildTableDOM(trains[key]);
    //         })
    //     }
    //     catch (error) {
    //         console.log("error:");
    //         console.log(error);
    //     }

    // }

    // function onSuccessFunc(data) {

    //     console.log(data.val());
    //     ;
    // }

    function onErrorFunc(error) {

        console.log("error:");
        console.log(error);
    }


/*     $("button.submitBtn").on("click", function (event) {

        if (trainNameInput.val() && destinationInput.val() && frequencyInput.val() && arrivalTimeInput.val()) {
            database.ref("trains").push(
                {
                    trainName: trainNameInput.val(),
                    destination: destinationInput.val(),
                    frequency: frequencyInput.val(),
                    arrivalTime: arrivalTimeInput.val()
                },
                function (error) {
                    console.log("error:");
                    console.log(error);
                })
            $("#trainForm")[0].reset();
            event.preventDefault();
        }
    }) */

    $("#trainForm").on("submit", function (event) {
        if (trainNameInput.val() && destinationInput.val() && frequencyInput.val() && arrivalTimeInput.val()) {
            database.ref("trains").push({
                trainName: trainNameInput.val(),
                destination: destinationInput.val(),
                frequency: frequencyInput.val(),
                arrivalTime: arrivalTimeInput.val()
            }, function (error) {
                console.log("error:");
                console.log(error);
            })
            $("#trainForm")[0].reset();
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