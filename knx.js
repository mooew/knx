var knx = require('knx');
var etsGA = require('./graph/ets').ets;

var test = 0;

if(test == 0){
  var heat_act= new knx.Datapoint({ga: '20/6/19', dpt: 'DPT1.001'});
  var cool_act= new knx.Datapoint({ga: '20/6/21', dpt: 'DPT1.001'});

  var output_pi_heat = new knx.Datapoint({ga: '20/6/25', dpt: 'DPT5.001'});
  var output_pwm_heat = new knx.Datapoint({ga: '20/6/23', dpt: 'DPT1.001'});

  var output_pi_heat_2 = new knx.Datapoint({ga: '20/6/28', dpt: 'DPT5.001'});
  var output_pwm_heat_2 = new knx.Datapoint({ga: '20/6/26', dpt: 'DPT1.001'});

  var output_pi_cool = new knx.Datapoint({ga: '20/6/32', dpt: 'DPT5.001'});
  var output_pwm_cool = new knx.Datapoint({ga: '20/6/30', dpt: 'DPT1.001'});

  var output_pi_cool_2 = new knx.Datapoint({ga: '20/6/35', dpt: 'DPT5.001'});
  var output_pwm_cool_2 = new knx.Datapoint({ga: '20/6/33', dpt: 'DPT1.001'});


  var ext_temp = new knx.Datapoint({ga: '20/2/1', dpt: 'DPT9.001'});



  var comf = new knx.Datapoint({ga: '20/4/3', dpt: 'DPT9.001'});



  var act_setpoint = new knx.Datapoint({ga: '20/4/10', dpt: 'DPT9.001'});

  var mode = new knx.Datapoint({ga: '20/5/4', dpt: 'DPT20.102'});
  var mode_fb = new knx.Datapoint({ga: '20/5/9', dpt: 'DPT20.102'});

  var hc_mode = new knx.Datapoint({ga: '20/5/14', dpt: 'DPT20.102'});
  var hc_mode_fb = new knx.Datapoint({ga: '20/5/15', dpt: 'DPT20.102'});

  var onoff= new knx.Datapoint({ga: '20/5/2', dpt: 'DPT1.001'});
  var onoff_fb = new knx.Datapoint({ga: '20/5/3', dpt: 'DPT1.001'});

  var windowStatus = new knx.Datapoint({ga: '20/5/1', dpt: 'DPT1.001'});

  var presenceStatus = new knx.Datapoint({ga: '20/5/0', dpt: 'DPT1.001'});

  var roomTemp = new knx.Datapoint({ga: '20/2/3', dpt: 'DPT9.001'});

//  var debug1 = new knx.Datapoint({ga: '20/0/5', dpt: 'DPT5.010'});



}else if(test == 1){

var output_pi_heat = new knx.Datapoint({ga: etsGA[0].ga , dpt: 'DPT5.001'});
var output_pwm_heat = new knx.Datapoint({ga: etsGA[1].ga, dpt: 'DPT1.001'});

var output_pi_heat_2 = new knx.Datapoint({ga: '0/1/3', dpt: 'DPT5.001'});
var output_pwm_heat_2 = new knx.Datapoint({ga: '0/1/4', dpt: 'DPT1.001'});

var output_pi_cool = new knx.Datapoint({ga: etsGA[2].ga, dpt: 'DPT5.001'});
var output_pwm_cool = new knx.Datapoint({ga: etsGA[3].ga, dpt: 'DPT1.001'});

var output_pi_cool_2 = new knx.Datapoint({ga: '0/1/7', dpt: 'DPT5.001'});
var output_pwm_cool_2 = new knx.Datapoint({ga: '0/1/8', dpt: 'DPT1.001'});


var ext_temp = new knx.Datapoint({ga: etsGA[4].ga, dpt: 'DPT9.001'});


var comf = new knx.Datapoint({ga: etsGA[5].ga, dpt: 'DPT9.001'});



var act_setpoint = new knx.Datapoint({ga: etsGA[6].ga, dpt: 'DPT9.001'});

var mode_fb = new knx.Datapoint({ga: etsGA[7].ga, dpt: 'DPT20.102'});
var mode = new knx.Datapoint({ga: etsGA[8].ga, dpt: 'DPT20.102'});

var hc_mode = new knx.Datapoint({ga: '0/1/14', dpt: 'DPT5.010'});
var hc_mode_fb = new knx.Datapoint({ga: '0/1/15', dpt: 'DPT5.010'});

var heat_act= new knx.Datapoint({ga: etsGA[9].ga, dpt: 'DPT1.001'});
var cool_act= new knx.Datapoint({ga: etsGA[10].ga, dpt: 'DPT1.001'});
}else if(test==2){

  var output_pi_heat = new knx.Datapoint({ga: '0/0/1', dpt: 'DPT5.001'});
  var output_pwm_heat = new knx.Datapoint({ga: '3/1/8', dpt: 'DPT1.001'});

  var output_pi_heat_2 = new knx.Datapoint({ga: '0/0/3', dpt: 'DPT5.001'});
  var output_pwm_heat_2 = new knx.Datapoint({ga: '0/0/4', dpt: 'DPT1.001'});

  var output_pi_cool = new knx.Datapoint({ga: '0/0/5', dpt: 'DPT5.001'});
  var output_pwm_cool = new knx.Datapoint({ga: '3/2/9', dpt: 'DPT1.001'});

  var output_pi_cool_2 = new knx.Datapoint({ga: '0/0/7', dpt: 'DPT5.001'});
  var output_pwm_cool_2 = new knx.Datapoint({ga: '0/0/8', dpt: 'DPT1.001'});


  var ext_temp = new knx.Datapoint({ga: '3/0/0', dpt: 'DPT9.001'});


  var comf = new knx.Datapoint({ga: '3/4/2', dpt: 'DPT9.001'});



  var act_setpoint = new knx.Datapoint({ga: '3/4/0', dpt: 'DPT9.001'});

  var mode_fb = new knx.Datapoint({ga: '3/3/5', dpt: 'DPT20.102'});
  var mode = new knx.Datapoint({ga: '3/3/4', dpt: 'DPT20.102'});

  var hc_mode = new knx.Datapoint({ga: '0/0/14', dpt: 'DPT5.001'});
  var hc_mode_fb = new knx.Datapoint({ga: '0/0/15', dpt: 'DPT5.001'});

  var heat_act= new knx.Datapoint({ga: '3/1/6', dpt: 'DPT1.001'});
  var cool_act= new knx.Datapoint({ga: '3/2/7', dpt: 'DPT1.001'});


}
else console.log("please check test parameter")

var ets = {
  output_pi_heat,
  output_pwm_heat,
  output_pi_heat_2,
  output_pwm_heat_2,

  output_pi_cool,
  output_pwm_cool,
  output_pi_cool_2,
  output_pwm_cool_2,

  act_setpoint,
  ext_temp, comf,

  mode_fb,
  mode,
  hc_mode,
  hc_mode_fb,

  heat_act,
  cool_act,
  onoff,
  onoff_fb,
  windowStatus,
  presenceStatus,
  roomTemp
  }

  function bindToGA(){
  for (var key in ets){
  //console.log(ets)
  var obj = ets[key];
  obj.bind(connection)
  console.log("bind to GA")
}
}

var connection = knx.Connection({
  ipAddr: '10.0.212.145', ipPort: 3671,
  physAddr: '1.1.129',
  //debug: true,
  handlers: {
    connected: function() {
      console.log('Connected to KNX!');
        bindToGA();
        /*
      for (var key in ets){
        //console.log(ets)
        var obj = ets[key];
        obj.bind(connection)
      }
      */

    },
    // display telegrams on th eknx bus

    event: function (evt, src, dest, value) {
//      console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j",
//      new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
//          evt, src, dest, value);

    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});


  module.exports.bindToGA = bindToGA
  module.exports.ets = ets
  module.exports.connection = connection
