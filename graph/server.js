//test
var express = require('express');
var socket = require('socket.io');
var path = require('path');
var bodyParser = require('body-parser');
var dataPunt = require('./data').dataPoint;
var moment = require('moment');
var Pusher = require('pusher');
var timer = require('./functions').timer;
var functionTemp = require('./functionTemp');
var knx = require('./functions').log_event;
var ets = require('../knx.js').ets
//var connection = require('../knx.js').connection



var pusher = new Pusher({
    appId: '426105',
    key: '95be360cf53aab13f769',
    secret: '164a62f9ce0d2f7ad82a',
    cluster: 'eu',
   encrypted: true
});


//App setup
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var londonTempData = {
    city: 'London',
    unit: 'celsius',
    dataPoints: [




    ]
  }
app.get('/ets', function(req, res){
  res.render('ets');
})

//API//
app.get('/getTemperature', function(req,res){
  res.send(londonTempData);
  console.log('/getTemperature: ' + londonTempData.dataPoints[londonTempData.dataPoints.length - 1].time)

});

//------------------------------------//
//update graph throug http GET request//
//------------------------------------//
/*
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

*/


//-------------------------------//
//update graph through server KNX//
//-------------------------------//


ets.dp2.on('change', function (oldvalue, newvalue) {
  console.log("KNX SP: value: %j °C", newvalue);

  dataPunt.sp = parseFloat(newvalue).toFixed(2);
  dataPunt.time = moment().format(' h:mm:ss ')

  pusher.trigger('london-temp-chart', 'new-data', {
    dataPoint: dataPunt
  });
  var help = new Object()
  help.time = dataPunt.time
  help.temp = dataPunt.temp
  help.pi = dataPunt.pi
  help.sp = dataPunt.sp
  londonTempData.dataPoints[londonTempData.dataPoints.length] = help
  //console.log('londonTempData: ' + londonTempData.dataPoints[londonTempData.dataPoints.length-1].time)
});



ets.dp1.on('change', function (oldvalue, newvalue) {
  console.log("KNX PI: value: %j %", newvalue);

  dataPunt.pi = parseFloat(newvalue).toFixed(2);
  dataPunt.time = moment().format(' h:mm:ss ');


  pusher.trigger('london-temp-chart', 'new-data', {
     dataPoint: dataPunt
  });
  var help = new Object()
  help.time = dataPunt.time
  help.temp = dataPunt.temp
  help.pi = dataPunt.pi
  help.sp = dataPunt.sp
  londonTempData.dataPoints[londonTempData.dataPoints.length] = help
});

//mode is updated by knx
ets.mode_fb.on('change', function (oldvalue, newvalue) {
//0 = OFF, 1 = heat, 2 = cool, 3 = auto
socket.emit('server-mode-fb', newvalue)
});

//mode is update by server

// functions
//autoate the room temperature
functionTemp.func.on('deltatemp', function(data){
  console.log('deltatemp ontvangen: ' + data.controller)
  dataPunt.temp = dataPunt.temp + data.controller;
  dataPunt.time = moment().format(' h:mm:ss ');


  pusher.trigger('london-temp-chart', 'new-data', {
    dataPoint: dataPunt
  });
  var help = new Object()
  help.time = dataPunt.time
  help.temp = dataPunt.temp
  help.pi = dataPunt.pi
  help.sp = dataPunt.sp
  londonTempData.dataPoints[londonTempData.dataPoints.length] = help
});



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


//----used for input fields----//

// comfort temperature
// the graph will be updated via response of KNX
    socket.on('input_comf', function(data){
        var inp = parseInt(data.inp);
        console.log('temp: ' + inp);
      ets.comf.write(inp);
  });

// ext temperature
// send to KNX and update graph

    socket.on('input_temp', function(data){
      temp = parseInt(data.inp);
      console.log('sp: ' +  temp);
      ets.ext_temp.write(temp);

      dataPunt.temp = temp;
      dataPunt.time = moment().format(' h:mm:ss ');


      pusher.trigger('london-temp-chart', 'new-data', {
        dataPoint: dataPunt
        });
      var help = new Object()
      help.time = dataPunt.time
      help.temp = dataPunt.temp
      help.pi = dataPunt.pi
      help.sp = dataPunt.sp
  londonTempData.dataPoints[londonTempData.dataPoints.length] = help
      });

//----used for button presses----//
    socket.on('mode', function(data){
      //0 = OFF, 1 = heat, 2 = cool, 3 = auto
      var mode = parseInt(data);
        console.log('mode: ' + mode);
        ets.mode.write(mode);
        /*
        if(mode === 0){
          //timer.setDelay(timer.getDelay() + 1000);
          //timer.start();
        }
        else if (mode === 1) {
          //timer.stop();
        }
        else if(mode === 2){
          /*
          if (functionTemp.timer.isStopped()) {
            console.log('start timer');
            functionTemp.timer.start();
          } else {
            console.log('stop timer');
            functionTemp.timer.stop();
          }

        }
        else if (mode === 3) {

        }
*/

    });

    socket.on('hvac', function(data){
      var mode = parseInt(data);
      console.log('hvac mode: ' + mode);
      //console.log(connection.connected)
      // test --> socket.emit('server-mode-fb', mode)

    });

});
