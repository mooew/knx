//functions
//var moment = require('moment');
var Timer = require('clockmaker').Timer;
var dataPunt = require('./data').dataPoint;
var EventEmitter = require('events').EventEmitter;

var func = new EventEmitter();
var delayMs = 1000 * 10;   //1 sec



var delta = {
  controller: null,
  roomLoss: null
};
var count = 0

//var knx_json_obj ={'destination': dest, 'value': val, 'time':date };

var timer = new Timer(function() {
count = count + 1
console.log(count)
//console.log('timer executed: ' + dataPunt.pi);
//delta.controller = (dataPunt.pi/200);
delta.controller = 1;

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
