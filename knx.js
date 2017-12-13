//hallo
var knx = require('knx');

var dp1 = new knx.Datapoint({ga: '0/3/8', dpt: 'DPT5.001'});
var pwm = new knx.Datapoint({ga: '0/3/8', dpt: 'DPT5.001'});
var dp2 = new knx.Datapoint({ga: '0/3/2', dpt: 'DPT9.001'});
var ext_temp = new knx.Datapoint({ga: '0/3/0', dpt: 'DPT9.001'});
var comf = new knx.Datapoint({ga: '0/3/3', dpt: 'DPT9.001'});
var mode_fb = new knx.Datapoint({ga: '0/3/4', dpt: 'DPT20.102'});
var mode = new knx.Datapoint({ga: '0/3/5', dpt: 'DPT20.102'});

var ets = {dp1, dp2, ext_temp, comf, mode_fb, mode}


var connection = knx.Connection({
  ipAddr: '10.0.211.39', ipPort: 3671,
  physAddr: '1.1.8',
  //debug: true,
  handlers: {
    connected: function() {
      console.log('Connected to KNX!');

      for (var key in ets){
        //console.log(ets)
        var obj = ets[key];
        obj.bind(connection)
      }

    },
    // display telegrams on th eknx bus
    event: function (evt, src, dest, value) {
      console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j",
      new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          evt, src, dest, value);

    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});



  module.exports.ets = ets
  //module.exports.connection = connection
