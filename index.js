var express = require('express');
var app = express()
var ioserver = require('http').Server(app);
var io = require('socket.io')(ioserver);

var knockout = require("knockout");
//var mygpio = require("./gpio");
//mygpio.init();

console.log("starting automation manager...");

// Fake GPIO handling
var readADC = function() {
    voltage = Math.random();
};


//tell express to serve static files from html
app.use(express.static(__dirname+"/html"));
app.use('/scripts', express.static(__dirname+"/scripts"));

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
    console.log("GPIO set: "+req.params.gpio+": " + JSON.stringify(req.body, null, 4));
    res.send(200);
    res.end();
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

var server = app.listen(80, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
