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
    res.send('Hello World!')
    res.send("The voltage is "+voltage);
})

var server = app.listen(80, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
})
