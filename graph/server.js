//test
var express = require('express');
var socket = require('socket.io');
var path = require('path');
var bodyParser = require('body-parser');
var dataPunt = require('./data').dataPoint;
var moment = require('moment');

var timer = require('./functions').timer;
var functionTemp = require('./functionTemp');
var knx = require('./functions').log_event;
var ets = require('../knx.js').ets
//var connection = require('../knx.js').connection






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

//-------------------------------//
//update graph through server KNX//
//-------------------------------//
//////////////////new js file ////////////////////////////////////////////

ets.setpoint.on('change', function (oldvalue, newvalue) {
  console.log("KNX SP: value: %j °C", newvalue);

  dataPunt.sp = parseFloat(newvalue).toFixed(2);
  dataPunt.time = moment().format(' h:mm:ss ')



  socket.emit('new-graph-data', dataPunt)

  //ctreate new object and store this in londonTempData array
  var help = new Object()
  help.time = dataPunt.time
  help.temp = dataPunt.temp
  help.pi = dataPunt.pi
  help.sp = dataPunt.sp
  londonTempData.dataPoints[londonTempData.dataPoints.length] = help
});



ets.output_pi.on('change', function (oldvalue, newvalue) {
  console.log("KNX PI: value: %j %", newvalue);

  dataPunt.pi = parseFloat(newvalue).toFixed(2);
  dataPunt.time = moment().format(' h:mm:ss ');



  socket.emit('new-graph-data', dataPunt)
//ctreate new object and store this in londonTempData array
  var help = new Object()
  help.time = dataPunt.time
  help.temp = dataPunt.temp
  help.pi = dataPunt.pi
  help.sp = dataPunt.sp
  londonTempData.dataPoints[londonTempData.dataPoints.length] = help
});


//hvac mode is update by server

// functions
//automate the room temperature
functionTemp.func.on('deltatemp', function(data){
  console.log('deltatemp ontvangen: ' + data.controller)
  dataPunt.temp = dataPunt.temp + data.controller;
  dataPunt.time = moment().format(' h:mm:ss ');

  /*
  pusher.trigger('london-temp-chart', 'new-data', {
    dataPoint: dataPunt
  });
  */
  console.log(dataPunt)
  socket.emit('new-graph-data', dataPunt)

  var help = new Object()
  help.time = dataPunt.time
  help.temp = dataPunt.temp
  help.pi = dataPunt.pi
  help.sp = dataPunt.sp
  londonTempData.dataPoints[londonTempData.dataPoints.length] = help
});


//////////////////new js file ////////////////////////////////////////////



//----used for input fields----//

// comfort temperature
// the graph will be updated via response of KNX
    socket.on('input_sp', function(data){
        var inp = parseInt(data.inp);
        var id = parseInt(data.id);
      //ets.comf.write(inp);
      switch (id){
        case 1:
          console.log('eco cool: ' + inp);
          break;
        case 2:
          console.log('standby cool: ' + inp);
          break;
        case 3:
          console.log('comfort cool: ' + inp);
          break;
        case 4:
          console.log('comfort heat: ' + inp);
          break;
        case 5:
          console.log('standby heat: ' + inp);
          break;
        case 6:
          console.log('eco heat: ' + inp);
      }

  });

// ext temperature
// send to KNX and update graph

    socket.on('input_temp', function(data){
      temp = parseInt(data.inp);
      console.log('sp: ' +  temp);
      ets.ext_temp.write(temp);

      dataPunt.temp = temp;
      dataPunt.time = moment().format(' h:mm:ss ');
/*

      pusher.trigger('london-temp-chart', 'new-data', {
        dataPoint: dataPunt
        });
        */
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
        console.log('h/c/a mode: ' + mode);
        //ets.hc_mode.write(mode);



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
      //1 = comf, 2 = stdby, 3 = eco, 4 = protect
      console.log('hvac mode: ' + mode);
      //ets.mode.write(mode);

    });

    //hvac mode is updated by knx
    ets.mode_fb.on('change', function (oldvalue, newvalue) {
    //1 = comf, 2 = stdby, 3 = eco, 4 = protect
    socket.emit('server-hvac-fb', newvalue)
    });

    // heat/cool/auto mode is updated by knx
    ets.hc_mode_fb.on('change', function (oldvalue, newvalue) {
      //0 = OFF, 1 = heat, 2 = cool, 3 = auto
    socket.emit('server-hc-fb', newvalue)
    });

    socket.on('script', function(data){
      console.log(data)
      if (functionTemp.timer.isStopped()) {
        console.log('start timer');
        functionTemp.timer.start();
      } else {
        console.log('stop timer');
        functionTemp.timer.stop();
      }
    })




});
