var express = require('express');
//var knockout = require("knockout");
//var mygpio = require("./gpio");
//mygpio.init();

console.log("starting automation manager...");

// Fake GPIO handling
var readADC = function() {
    voltage = Math.random();
};

// Webserver
var app = express()
app.configure(function() {
    //tell express to serve static files from html
    app.use(express.static(__dirname+"/html"));
});

// Get states for all configured GPIO pins
app.get("/api/gpio", function(req, res) {
    res.json(200, [
        { gpio: 67, value: 1 },
        { gpio: 68, value: 1 },
        { gpio: 44, value: 1 },
        { gpio: 26, value: 1 },
        { gpio: 46, value: 1 }
    ]);
    res.end();
});

// set single GPIO pin
app.put("/api/gpio/:gpio", function(req, res) {
    console.log(req.params.gpio+": " + JSON.stringify(req.body, null, 4));
    res.send(200);
    res.end();
});

var server = app.listen(80, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

// Feed MQTT data to adafruit.io
console.warn(process.env.AIO_FEED)
console.warn(process.env.AIO_USER+':'+process.env.AIO_KEY)

var mqtt = require('mqtt')
var client  = mqtt.connect({'host': 'io.adafruit.com',
                            'username': process.env.AIO_USER,
                            'password': process.env.AIO_KEY});

var intervalId = null;

client.on('connect', function() {
    client.subscribe(process.env.AIO_FEED);

    console.warn("Connected to adafruit.io");

    client.on('message', function (topic, message) {
        console.warn(topic+': '+message.toString());
    });

    var sendMsg = function () {
        var voltageMeasurement = readADC*10
        client.publish(process.env.AIO_FEED, ''+voltageMeasurement.toFixed(3));
    }

    if(intervalId != null) {
        console.warn("Cleared old interval ID")
        clearInteval(intervalId);
    }

    intervalId = setInterval(sendMsg, 5000);
});