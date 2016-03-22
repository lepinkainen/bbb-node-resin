console.log("starting automation manager...")

// Fake GPIO handling
var voltage = 0;

var readADC = function() {
    voltage = Math.random()
};

setInterval(readADC, 3000);

// Webserver
var express = require('express')
var app = express()

app.get('/', function (req, res) {
    res.send("The voltage is "+voltage);
})

var server = app.listen(80, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
})


// Feed MQTT data to adafruit.io
console.warn(process.env.AIO_FEED)
console.warn(process.env.AIO_USER+':'+process.env.AIO_KEY)

var mqtt = require('mqtt')
var client  = mqtt.connect({'host': 'io.adafruit.com',
                            'username': process.env.AIO_USER,
                            'password': process.env.AIO_KEY});

client.on('connect', function() {
    client.subscribe(process.env.AIO_FEED);

    console.warn("Connected");

    client.on('message', function (topic, message) {
        console.warn(topic+': '+message.toString());
    });

    var sendMsg = function () {
        var voltageMeasurement = voltage*10
        client.publish(process.env.AIO_FEED, ''+voltageMeasurement.toFixed(3));
    }

    setInterval(sendMsg, 5000);
});
