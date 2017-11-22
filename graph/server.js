//test
var express = require('express');
var socket = require('socket.io');
var path = require('path');
var bodyParser = require('body-parser');
var moment = require('moment');
var Pusher = require('pusher');
var timer = require('./functions').timer;
var timerTemp = require('./functionTemp').timer;
var knx = require('./functions').log_event;
var logKNX = require('../utilities/test').log_event;
var WriteToBus  = require('../knx_eibd').WriteToBus;


var pusher = new Pusher({
    appId: '426105',
    key: '95be360cf53aab13f769',
    secret: '164a62f9ce0d2f7ad82a',
    cluster: 'eu',
   encrypted: true
});

// PI always come from knx
// SP can come from KNX and functions and DOM
// TT comes from function or DOM
var pi = null,
    sp = null,
    temp = null,
    time = null;

//App setup
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var londonTempData = {
    city: 'London',
    unit: 'celsius',
    dataPoints: [

    ],
    piController: [

    ]
  };

var wietse = {};
//API//
app.get('/getTemperature', function(req,res){
  res.send(londonTempData);
});

//------------------------------------//
//update graph throug http GET request//
//------------------------------------//
app.get('/addTemperature', function(req,res){

  var temp = parseInt(req.query.temperature);
  var time = parseInt(req.query.time);
  if(temp && time && !isNaN(temp) && !isNaN(time)){


    var newDataPoint = {
      temp: temp,
//      time: time
      time: moment().format(' h:mm:ss ')
    };
    //londonTempData.dataPoints.push(newDataPoint);         //ad new datapoint to array
    //trigger event event and send newDataPoint
    pusher.trigger('london-temp-chart', 'new-temperature', {
      dataPoint: newDataPoint
    });


    res.send({success:true});


  }else{
    res.send({success:false, errorMessage: 'Invalid Query Paramaters, required - temperature & time.'});
  }
});



//----------------------------

app.get('/addTemperature1', function(req,res){

  var temp = parseInt(req.query.temperature);
  var time = parseInt(req.query.time);
  if(temp && time && !isNaN(temp) && !isNaN(time)){


    var newDataPoint = {
      temp: temp,
//      time: time
      time: moment().format(' h:mm:ss ')
    };
    //londonTempData.dataPoints.push(newDataPoint);         //ad new datapoint to array
    //trigger event event and send newDataPoint
    pusher.trigger('london-temp-chart', 'new-temperature1', {
      dataPoint: newDataPoint
    });


    res.send({success:true});


  }else{
    res.send({success:false, errorMessage: 'Invalid Query Paramaters, required - temperature & time.'});
  }
});

//-------------------------------//
//update graph through server KNX//
//{'source': src, 'destination': dest,
//  'type': dpt, 'value': val, 'time':date };
//destination:  0/3/1 => setpoint
//              0/3/0 => pi
//-------------------------------//

knx.on('bus_event', function(data){
  //console.log('good job');
  //console.log(data);
  if(data.destination == '0/3/2'){
    console.log(data)
     console.log('sp')
	console.log(data.value)
     sp = parseFloat(data.value).toFixed(2);

     //sp = data.value;
     time = data.time;


    var newDataPoint = {
      temp: temp,
      //time: time,
      time: moment().format(' h:mm:ss '),
      pi: pi,
      sp: sp
      //time: moment().format(' h:mm:ss ')
    };
    console.log(newDataPoint);
    pusher.trigger('london-temp-chart', 'new-data', {
      dataPoint: newDataPoint
  });

  }else if(data.destination == '0/3/8'){

    //var pi = parseFloat(data.value).toFixed(1);
      pi = (data.value / 255) * 100;
     time = data.time;

    var newDataPoint = {
      temp: temp,
    //  time: time,
      time: moment().format(' h:mm:ss '),
      pi: pi,
      sp: sp
      //time: moment().format(' h:mm:ss ')

    }
    console.log(newDataPoint);
    pusher.trigger('london-temp-chart', 'new-data', {
      dataPoint: newDataPoint
  });
console.log(londonTempData);
  }else {console.log('unknown source haha')}



});


// setpoint data SP


    /*

logKNX.on('dim', function(data){
  var temp = parseFloat(data.value).toFixed(2);
//  var time = parseInt(req.query.time);  parseFloat(yourString).toFixed(2)

  var newDataPoint = {
    temperature: temp,
//      time: time
    time: moment().format(' h:mm:ss ')
  };

  console.log(newDataPoint);

  //store londonTempData.dataPoints.push(newDataPoint);         //ad new datapoint to array

  //trigger event event and send newDataPoint
  pusher.trigger('london-temp-chart', 'new-temperature', {
    dataPoint: newDataPoint
  });
});

//PI controller data
logKNX.on('PI', function(data){
  var temp = parseFloat(data.value).toFixed(2);
//  var time = parseInt(req.query.time);  parseFloat(yourString).toFixed(2)

  var newDataPoint = {
    temperature: temp,
//      time: time
    time: moment().format(' h:mm:ss ')
  };

  console.log(newDataPoint);

  //store londonTempData.piController.push(newDataPoint);         //ad new datapoint to array

  //trigger event event and send newDataPoint
  pusher.trigger('london-temp-chart', 'new-temperature1', {
    dataPoint: newDataPoint
  });
});

         */



// Error Handler for 404 Pages
app.use(function(req, res, next) {
    var error404 = new Error('Route Not Found');
    error404.status = 404;
    next(error404);
});

module.exports = app;

var server = app.listen(9000, function(){
  console.log('Example app listening on port 9000!')
});


////////////////////////////////////////////
/////// Socket setup & pass server /////////
////////////////////////////////////////////
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle  events
    socket.on('trigger', function(data){
        var dim = parseInt(data.dim);
        console.log(dim);
//        WriteToBus('0/0/6','DPT5',dim);                                          KNX off

    });

//----used for input fields----//
    socket.on('input_comf', function(data){
        var inp = parseInt(data.inp);
        console.log('temp: ' + inp);
        WriteToBus('0/3/3','DPT9',inp);                                             
  });
socket.on('input_temp', function(data){
     temp = parseInt(data.inp);
    console.log('sp: ' +  temp);
        WriteToBus('0/3/0','DPT9',temp);

  //update graph

  var newDataPoint = {
    temp: temp,
    time: moment().format(' h:mm:ss '),
    pi: pi,
    sp: sp
    //time: moment().format(' h:mm:ss ')

  }
  console.log(newDataPoint);
  pusher.trigger('london-temp-chart', 'new-data', {
    dataPoint: newDataPoint
});

    });
//----used for button presses----//
    socket.on('mode', function(data){
      var mode = parseInt(data.mode);
        console.log(mode);

        if(mode === 1){
          //timer.setDelay(timer.getDelay() + 1000);
          timer.start();
        }
        else if (mode === 2) {
          timer.stop();
        }
        else if(mode === 3){
          console.log('start timer');
          timerTemp.start(pi);
        };
//        WriteToBus('0/0/6','DPT5',dim);                                                KNX off

    });

});
