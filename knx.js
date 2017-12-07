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


  var dim_control = new knx.Datapoint({ga: '0/0/6', dpt: 'DPT5.005'});
  // bind it to the active connection
  dim_control.bind(connection);

  var ext_temp = new knx.Datapoint({ga: '0/3/0', dpt: 'DPT9.001'});
  // bind it to the active connection
  ext_temp.bind(connection);

  var comf = new knx.Datapoint({ga: '0/3/3', dpt: 'DPT9.001'});
  // bind it to the active connection
  comf.bind(connection);


  module.exports.ext_temp = ext_temp
  module.exports.comf = comf
  module.exports.connection = connection
  module.exports.dp1 = dp1
  module.exports.dp2 = dp2
