var express = require('express');
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

//var knockout = require("knockout");
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
    res.status(200).json([
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
