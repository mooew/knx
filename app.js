


console.log('starting project')

//***** This is a node application designed to act as a core
//var knx  	= require('./knx_eibd');
//var knx  	= require('./knx');
//require('./utilities/test');
require('./graph/server');

// import usb logger
//require('./node_modules/utilities/usb_logger');

// import send message to bus
//var sendMsg = require('./node_modules/utilities/send_msg_to_bus').sendMsg;
// example use of sendMsg
//sendMsg("0/2/40", "write", "DPT1", 0);

// import timed jobs for knx. This auto reads from a csv file to make jobs
// The file with cron jobs is on the usb in knx_jobs folder
//require('./node_modules/utilities/knx_cron_jobs');


//This runs a bluetooth connection to a sensortag that monitors humidity
// when humidity runs high the towel rails come on for 30mins
//require('./node_modules/utilities/sensortag_bath');


//This initiates a set of scenes associated with a number of group addresses
//var scenes_test = require('./node_modules/utilities/scenes_test');
//var test = require('./node_modules/utilities/test');

// This sets up the door monitor
//require('./node_modules/utilities/doors');

// This sets up the tank monitor
//require('./node_modules/utilities/ultrasound');

//This sets up the main area average generator
//require('./node_modules/utilities/main_temp_avg');

// This sets up the server...
//require('./node_modules/server')

//This sets up the key databases used
//require('./node_modules/utilities/db');
