var b = require('octalbonescript'); //load the library
console.log("starting ADC script...")
  // no pinmode is required for analogRead as those pins are dedicated.
var pin = 'P9_33'; //the pin to operate on

var readADC = function() {
  b.analogRead(pin, function(err, value) {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Analog Value: ' + value); // value is floating point number between 0 and 1.
    console.log('Voltage: ' + value * 1.8 + ' V')
  });
};

setInterval(readADC, 3000);

//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8080;

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
