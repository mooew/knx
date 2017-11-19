//functions
var Timer = require('clockmaker').Timer;
var logKNX = require('../utilities/test').log_event;
var delayMs = 4000;
var start = 20;
var PI = 0;

var timer = new Timer(function(test) {
  console.log('Another 4 seconds done');
  //send something to knx_eibd

  //send directly to the DOM


  //test emit a bus telegramm



logKNX.emit('dim', {value: start});
logKNX.emit('PI', {value: PI});
if(PI === 0){PI = 100;
}else {PI = 0};
if(start < 23){
  start = start + 0.5;
}else {start = 19};



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
