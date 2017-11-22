//functions
//var moment = require('moment');
var Timer = require('clockmaker').Timer;
//var logKNX = require('../utilities/test').log_event;
//var knx = require('../knx_eibd').knx_event;
//var pi = require('./server').pi
var EventEmitter = require('events').EventEmitter;

var func = new EventEmitter();
var delayMs = 1000 * 1;   //1 sec

var pi = 20;
var delta = {
  controller: null,
  roomLoss: null
};


//var knx_json_obj ={'destination': dest, 'value': val, 'time':date };

var timer = new Timer(function() {
console.log('timer executed: ' + pi);
delta.controller = (pi/200);

func.emit('deltatemp', delta);

}, delayMs, {
  repeat: true

});





//timer.start();
//timer.setDelay(timer.getDelay() + 1000);
//timer.getNumTicks()
/*
// This second timer which will stop/start the first timer every 5 seconds
Timer(function() {
  if (timer.isStopped()) {
    timer.start();
  } else {
    timer.stop();
  }
}, 5000, {
  repeat: true
}).start();
*/

module.exports.timer = timer;
module.exports.func = func;
module.exports.pi = pi;
//exports.log_event = knx;
