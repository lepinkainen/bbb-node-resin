var b = require('octalbonescript'); //load the library
console.log("starting ADC script...")
  // no pinmode is required for analogRead as those pins are dedicated.
var pin = 'P9_33'; //the pin to operate on

var voltage = 0;

var readADC = function() {
    b.analogRead(pin, function(err, value) {
        if (err) {
            console.error(err.message);
            return;
        }
        voltage = value;
        console.log('Analog Value: ' + value); // value is floating point number between 0 and 1.
        console.log('Voltage: ' + value * 1.8 + ' V')
    });
};

setInterval(readADC, 3000);

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

});

var sendMsg = function () {
    var voltageMeasurement = voltage*10
    client.publish(process.env.AIO_FEED, ''+voltageMeasurement);
}

setInterval(sendMsg, 5000);
