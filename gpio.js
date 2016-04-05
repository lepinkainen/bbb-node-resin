var onoff = require('onoff'); //load the library

// Reset all relays to set initial state
module.exports.init = function(initialState) {
    initialState = initialState || 'high';

    var Gpio = onoff.Gpio;
    var relay1 = new Gpio(67, initialState);
    var relay2 = new Gpio(68, initialState);
    var relay3 = new Gpio(44, initialState);
    var relay4 = new Gpio(26, initialState);
    var relay5 = new Gpio(46, initialState);
    var relay6 = new Gpio(65, initialState);
    var relay7 = new Gpio(47, initialState);
    var relay8 = new Gpio(27, initialState);
}
