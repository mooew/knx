//functions
//var moment = require('moment');
var Timer = require('clockmaker').Timer;
var dataPunt = require('./data').dataPoint;
var EventEmitter = require('events').EventEmitter;

var func = new EventEmitter();
var delayMs = 1000 * 10;   //1 sec
var cash = dataPunt
var hh = dataPunt.pi_heat;
var cc = dataPunt.pi_cool;


var delta = {
  controller: null,
  roomLoss: null
};
var count = 0,
  inertia = 200;

//var knx_json_obj ={'destination': dest, 'value': val, 'time':date };

var timer = new Timer(function() {
count = count + 1
console.log(count)
console.log(cash.pi_cool)
//console.log('timer executed: ' + dataPunt.pi);
/////////////////////////HEATING//////////////////////////////
if(cash.pi_heat > 0){

delta.controller = (hh/(200));

console.log('temp goes up: ' + delta.controller);

}
else if(cash.pi_cool > 0 ){

delta.controller = (cc/(-200));

console.log('temp goes down: ' + delta.controller);

}else{
  delta.controller = 0;
}

if(count%20 == 0){     //every 20 steps
  cash = dataPunt
  hh = dataPunt.pi_heat;
  cc = dataPunt.pi_cool;
  console.log('step 5')
}

///////////////////////COOLING/////////////////////////////////



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
