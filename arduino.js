'use strict'

// ./node_modules/.bin/interchange install hc-sr04 -a uno -p /dev/cu.usbmodem1421 --firmata

var five = require("johnny-five"),
  board,
  potentiometer1,
  forceResistor1,
  forceResistor2,
  ultrasonic1;

const WebSocket = require('ws');

board = new five.Board();

board.on("ready", function() {

  let pot1, fsr1 = 0, fsr2 = 0, proximity = 100, fsr1Hit = false;

  potentiometer1 = new five.Sensor({
    pin: "A0",
    freq: 250
  });

  forceResistor1 = new five.Sensor({
    pin: "A1",
    freq: 10
  });

  forceResistor2 = new five.Sensor({
    pin: "A2",
    freq: 10
  });

  ultrasonic1 = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  });


  //TODO: init ultrasounic

  const wss = new WebSocket.Server({ port: 8080 });

  let socket
  wss.on('connection', function connection(ws) {
    socket = ws
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    ws.send(JSON.stringify({ message: 'hello' }));
  });

  const sendSensorData = () => {
    if(socket && socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify({ 
        event: 'sensor',
        pot1,
        fsr1,
        fsr2,
      }));
    }
  }

  potentiometer1.on("data", function() {
    pot1 = this.value
    sendSensorData();
  });

  forceResistor1.on("data", function() {
    fsr1 = this.value
    sendSensorData();
  });

  forceResistor2.on("data", function() {
    fsr2 = this.value
    sendSensorData();
  });

  ultrasonic1.on("data", function() {
    proximity = this.cm
    console.log(`Proximity: ${this.cm} cm`);
    sendSensorData();
  });

  ultrasonic1.on("change", function() {
    console.log("The obstruction has moved.");
  });

});


