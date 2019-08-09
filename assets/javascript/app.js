$(document).ready(function () {

    function onErrorFunc(error) {

        $("div.errorModalBody").html(error + "<br>Please reload the page");
        $("#errorModal").modal('show');
    }
    
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
    let database = null;

    try{
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
    } catch(error) {
        onErrorFunc(error);
    }


    function buildTableDOM(data) {
        let trainObject = data.val();
        let $tr = $("<tr>").attr("id", data.key);
        let $name = $("<td>");
        let $destination = $("<td>");
        let $frequency = $("<td>");
        let $nextArrival = $("<td>").addClass("nextArrival");
        let $minutesAway = $("<td>").addClass("minutesAway");

        $name.text(trainObject.trainName);
        $destination.text(trainObject.destination);
        $frequency.text(trainObject.frequency);
        $nextArrival.text(calcNextArrival(trainObject.frequency, trainObject.arrivalTime).trainArrival);
        $minutesAway.text(calcNextArrival(trainObject.frequency, trainObject.arrivalTime).trainMinutes);
        if(calcNextArrival(trainObject.frequency, trainObject.arrivalTime).trainMinutes < 6) {
            $minutesAway.css({
                "color": "#FF0000",
                "font-weight": "600",
            });
        }

        $tr.append($name, $destination, $frequency, $nextArrival, $minutesAway);
        $("tbody").append($tr);
    }

    function calcNextArrival(frequency, firstArrival) {

        //next arrival = (currentTime + (frequency - ((currentTime - firstArrival) % frequency)))

        let firstArrivalConverted = moment(firstArrival, "HH:mm").subtract(1, "years");

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

        // console.log(moment(nextTrainTime).format("HH:mm"));

        return {
            trainArrival: moment(nextTrainTime).format("hh:mm a"),
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
        onErrorFunc(error);
    })

    database.ref("trains").on("child_added", (data) => { buildTableDOM(data) }, onErrorFunc);

    setInterval( () => {
        database.ref("trains").on("value", (data) => { updateTime(data) }, onErrorFunc);
    }, 1000)

    function updateTime(data) {
        // $("tbody").empty();

        let trains = data.val();

        try {
            let trainKeys = Object.keys(trains);

            trainKeys.forEach((key) => {
                $(`#${key} td.nextArrival`).text(calcNextArrival(trains[key].frequency, trains[key].arrivalTime).trainArrival);
                $(`#${key} td.minutesAway`).text(calcNextArrival(trains[key].frequency, trains[key].arrivalTime).trainMinutes);
            })
        }
        catch (error) {
            onErrorFunc(error);
        }
    }

    $("#trainForm").on("submit", function (event) {
        if (trainNameInput.val() && destinationInput.val() && frequencyInput.val() && arrivalTimeInput.val()) {
            database.ref("trains").push({
                trainName: trainNameInput.val().trim(),
                destination: destinationInput.val().trim(),
                frequency: frequencyInput.val().trim(),
                arrivalTime: arrivalTimeInput.val().trim()
            }, function (error) {
                console.log(error);
            })
            // updateTime();
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