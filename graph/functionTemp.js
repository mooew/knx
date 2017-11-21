//functions
//var moment = require('moment');
var Timer = require('clockmaker').Timer;
//var logKNX = require('../utilities/test').log_event;
//var knx = require('../knx_eibd').knx_event;
var delayMs = 1000;
var pi;





//var knx_json_obj ={'destination': dest, 'value': val, 'time':date };

var timer = new Timer(function() {

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
//exports.log_event = knx;
