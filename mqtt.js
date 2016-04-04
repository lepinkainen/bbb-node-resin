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
        var voltageMeasurement = readADC()*10
        client.publish(process.env.AIO_FEED, ''+voltageMeasurement.toFixed(3));
    }

    if(intervalId != null) {
        console.warn("Cleared old interval ID")
        clearInteval(intervalId);
    }

    intervalId = setInterval(sendMsg, 5000);
});
