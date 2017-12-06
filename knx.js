var knx = require('knx');



var dp1 = new knx.Datapoint({ga: '0/3/8', dpt: 'DPT5.001'});
var dp2 = new knx.Datapoint({ga: '0/3/2', dpt: 'DPT9.001'});

var connection = knx.Connection({
  ipAddr: '192.168.2.221', ipPort: 3671,
  physAddr: '1.1.8',


 handlers: {
  connected: function() {
    console.log('Connected!');
    con = true;

    dp1.bind(connection);
    dp2.bind(connection);

/*
    dp2.read((src, value) => {
      console.log("**** RESPONSE %j reports current value 0/3/0: %j", src, value);
    });
    dp1.read((src, value) => {
      console.log("**** RESPONSE %j reports current value 0/3/8: %j", src, value);
    });
*/





    },
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



//------------------

  // declare a simple binary control datapoint
  //var binary_control = new knx.Datapoint({ga: '0/0/5', dpt: 'DPT1.001'});
  // bind it to the active connection
  //binary_control.bind(connection);

  var dim_control = new knx.Datapoint({ga: '0/0/6', dpt: 'DPT5.005'});
  // bind it to the active connection
  dim_control.bind(connection);

  var ext_temp = new knx.Datapoint({ga: '0/3/0', dpt: 'DPT9.001'});
  // bind it to the active connection
  ext_temp.bind(connection);

  var comf = new knx.Datapoint({ga: '0/3/3', dpt: 'DPT9.001'});
  // bind it to the active connection
  comf.bind(connection);

//  var pi = new knx.Datapoint({ga: '0/3/8', dpt: 'DPT5.001'});
  // bind it to the active connection
//  pi.bind(connection);

  //binary_control.write(data.checkbox);


/*
  dp1.on('change', function(oldvalue, newvalue){
    console.log('dp1: ' + newvalue + ' %')
  });
  dp2.on('change', function(oldvalue, newvalue){
    console.log('dp2: ' + newvalue + '°C')
  });
*/

//  module.exports.binary_control = binary_control
  module.exports.ext_temp = ext_temp
  module.exports.comf = comf
  module.exports.connection = connection
  module.exports.dp1 = dp1
  module.exports.dp2 = dp2
