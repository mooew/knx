//functions
var moment = require('moment');
var Timer = require('clockmaker').Timer;
var logKNX = require('../utilities/test').log_event;
var knx = require('../knx_eibd').knx_event
var delayMs = 4000;
var start = 20;
var PI = 0;
var dest = null,
    val = null,
    date = null;
var tick = 0;
var knx_json_obj ={'destination': dest, 'value': val, 'time':date };

var timer = new Timer(function(test) {
  console.log('Another 4 seconds done ' + timer.getNumTicks());
  //send something to knx_eibd

  //send directly to the DOM


  //test emit a bus telegramm



tick = tick + 1;
if((tick%2)==0) {

  knx_json_obj.destination = '0/0/1';
  knx_json_obj.value = start;
  knx_json_obj.time = moment().format(' h:mm:ss ');

//  logKNX.emit('dim', {value: start});
  knx.emit('bus_event', knx_json_obj);

  if(start < 23){
    start = start + 0.5;
  }else {start = 19};


} else {

  knx_json_obj.destination = '0/0/2';
  knx_json_obj.value = PI;
  knx_json_obj.time = moment().format(' h:mm:ss ');

//  logKNX.emit('PI', {value: PI});
  knx.emit('bus_event', knx_json_obj);
  if(PI === 0){PI = 100;
  }else {PI = 0};

};













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
exports.log_event = knx;
