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

        getLastArrival: function (train) {
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
        $nextArrival.text(calcNextArrival(trainObject.frequency, trainObject.arrivalTime).trainArrival);
        $minutesAway.text(calcNextArrival(trainObject.frequency, trainObject.arrivalTime).trainMinutes);

        $tr.append($name, $destination, $frequency, $nextArrival, $minutesAway);
        $("tbody").append($tr);
    }

    function calcNextArrival(frequency, firstArrival) {

        //next arrival = (currentTime + (frequency - ((currentTime - firstArrival) % frequency)))

        console.log(moment());

        let firstArrivalConverted = moment(firstArrival, "HH:mm").subtract(1, "years");
        // console.log(`firstArrivalConverted: ${moment(firstArrival, "HH:mm").subtract(1, "years").format("hh:mm")}`)

        let currentTime = moment();
        // console.log(`Current Time: ${moment(currentTime).format("hh:mm")}`)

        let timeDiff = moment().diff(moment(firstArrivalConverted), "minutes");
        // console.log(`Difference in time: ${timeDiff}`)

        let tRemainder = timeDiff % frequency;
        // console.log(`tRemainder: ${tRemainder}`)

        let tMinutesTillTrain = frequency - tRemainder;
        // console.log(`Minutes till train: ${tMinutesTillTrain}`)

        let nextTrainTime = moment().add(tMinutesTillTrain, "minutes");
        // console.log(`Arrival Time: ${moment(nextTrainTime).format("hh:mm")}`)

        // return moment(nextTrainTime).format("hh:mm");

        return {
            trainArrival: moment(nextTrainTime).format("hh:mm"),
            trainMinutes: tMinutesTillTrain
        }
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

    let provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
})