//Load in required modules and log starting
//var knx_json_obj ={'source': src, 'destination': dest, 'type': dpt, 'value': val, 'time':date };

var WriteToBus  = require('../knx_eibd').WriteToBus;
var knx = require('../knx_eibd').knx_event

var ReadFromBus  = require('../knx_eibd').ReadFromBus;
var EventEmitter = require('events').EventEmitter;
var log_emitter = new EventEmitter();


console.log('starting test');


knx.on('bus_event', function(data){
		//console.log('bus monitor: ' + data.val);

	if(data.destination == '0/0/6'){
		log_emitter.emit('dimValue', data);
		console.log('destination');
		console.log(data.destination);
		//console.log('read Temp');
		//ReadFromBus("0/0/6", "DPT9");

		//pusher
		//log_emitter.emit('dim', data);


		}
	});

exports.log_event = log_emitter;
