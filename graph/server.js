//test
var express = require('express');
var socket = require('socket.io');
var path = require('path');
var bodyParser = require('body-parser');
var dataPunt = require('./data').dataPoint;
var moment = require('moment');

//var timer = require('./functions').timer;
var functionTemp = require('./functionTemp');
//var knx = require('./functions').log_event;
var ets = require('../knx.js').ets
var con = require('../knx.js').connection

var test = true;     //true if no knx is availeble



function storePoint(data){
  //ctreate new object and store this in logData array
  console.log(data)
  var help = new Object()
  help.time = data.time
  help.temp = data.temp
  help.pi = data.pi
  help.pi_cool = data.pi_cool
  help.sp = data.sp
  logData.dataPoints[logData.dataPoints.length] = help
}



//App setup
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var logData = {
    dataPoints: []
  }



//API//
app.get('/getTemperature', function(req,res){
  res.send(logData);
  console.log('/getTemperature: ')
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
    //logData.dataPoints.push(newDataPoint);         //ad new datapoint to array
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
/////// SOCKET setup & pass server /////////
////////////////////////////////////////////
var io = socket(server);
io.on('connection', (socket) => {

  console.log('made socket connection', socket.id);

  function updateGraph(data){
    console.log("received: " + data)
    io.emit('new-graph-data', data)
    storePoint(data)
  }

//-------------------------------//
//update graph through server KNX//
//-------------------------------//
//////////////////new js file ////////////////////////////////////////////


//////////////////new js file ////////////////////////////////////////////

function ldexp(mantissa, exponent) {
   return exponent > 1023 // avoid multiplying by infinity
        ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
        : exponent < -1074 // avoid multiplying by zero
        ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
        : mantissa * Math.pow(2, exponent);
}


//----used for input fields----//

// comfort temperature
// the graph will be updated via response of KNX
    socket.on('input_sp', function(data){
        var inp = parseInt(data.inp);
        var id = parseInt(data.id);
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
          if(!test){
            ets.comf.write(inp);}
          if(test){
            dataPunt.sp = inp;
            dataPunt.time = moment().format(' h:mm:ss ');

///////////////////////////////////////////////////
              updateGraph(dataPunt)
//            io.emit('new-graph-data', dataPunt)
//            storePoint(dataPunt)
///////////////////////////////////////////////////

            }
          break;
        case 5:
          console.log('standby heat: ' + inp);
          break;
        case 6:
          console.log('eco heat: ' + inp);


//test//
          con.read("0/0/7", (src, responsevalue) => {
            var buf = responsevalue

            var sign     =  buf[0] >> 7;
            var exponent = (buf[0] & 0b01111000) >> 3;
            var mantissa = 256 * (buf[0] & 0b00000111) + buf[1];


          console.log(ldexp((0.01*mantissa), exponent));

         });
//test//


}   //end switch

}); //end socket setpoints

// ext temperature
// send to KNX and update graph

    socket.on('input_temp', function(data){
      temp = parseFloat(data.inp).toFixed(2)
      console.log('sp: ' +  temp);
      if(!test){ets.ext_temp.write(temp);}

      dataPunt.temp = temp;
      dataPunt.time = moment().format(' h:mm:ss ');

///////////////////////////////////////////////////
      updateGraph(dataPunt)
//      io.emit('new-graph-data', dataPunt)
//      storePoint(dataPunt)
///////////////////////////////////////////////////

      });

//----used for button presses----//
    socket.on('mode', function(data){
      //0 = OFF, 1 = heat, 2 = cool, 3 = auto
      var mode = parseInt(data);
        console.log('h/c/a mode: ' + mode);
        if(!test){ets.hc_mode.write(mode);}



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
      if(!test){ets.mode.write(mode);}

    });

///////////////////update DOM////////////////////

    //hvac mode is updated by knx
    ets.mode_fb.on('change', function (oldvalue, newvalue) {
    //1 = comf, 2 = stdby, 3 = eco, 4 = protect
    io.emit('server-hvac-fb', newvalue)
    });

    // heat/cool/auto mode is updated by knx
    ets.hc_mode_fb.on('change', function (oldvalue, newvalue) {
      //0 = OFF, 1 = heat, 2 = cool, 3 = auto
    io.emit('server-hc-fb', newvalue)
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
  });   //io.on socket end


  //--------------------setpoint--------------------------//

  ets.act_setpoint.on('change', function (oldvalue, newvalue) {
    console.log("KNX SP: value: %j °C", newvalue);

    dataPunt.sp = parseFloat(newvalue).toFixed(2);
    dataPunt.time = moment().format(' h:mm:ss ')

    updateGraph(dataPunt)


  });


  //----------------listen to KNX for PI or PWM ---------------------//
//PI HEAT//
  ets.output_pi_heat.on('change', function (oldvalue, newvalue) {
    console.log("KNX PI: value: %j %", newvalue);

    dataPunt.pi = newvalue.toFixed(2);
    dataPunt.time = moment().format(' h:mm:ss ');

    updateGraph(dataPunt)


  });

//PWM HEAT//
  ets.output_pwm_heat.on('change', function (oldvalue, newvalue) {

    newvalue = newvalue ? 1 : 0;
    console.log("KNX PI: value: %j %", newvalue);
    dataPunt.pi = newvalue * 100;
    dataPunt.time = moment().format(' h:mm:ss ');

    updateGraph(dataPunt)


  });

//PI COOL//
  ets.output_pi_cool.on('change', function (oldvalue, newvalue) {
    console.log("KNX PI: value: %j %", newvalue);

    dataPunt.pi_cool = newvalue;
    dataPunt.time = moment().format(' h:mm:ss ');

    updateGraph(dataPunt)

  });

//PWM COOL//
  ets.output_pwm_cool.on('change', function (oldvalue, newvalue) {

    newvalue = newvalue ? 1 : 0;
    console.log("KNX PI: value: %j %", newvalue);
    dataPunt.pi_cool = newvalue * 100;
    dataPunt.time = moment().format(' h:mm:ss ');

    updateGraph(dataPunt)


  });

  //hvac mode is update by server

  // functions
  //automate the room temperature
  functionTemp.func.on('deltatemp', function(data){
    console.log('deltatemp ontvangen: ' + data.controller)
    console.log( Number(dataPunt.temp))
    dataPunt.temp = Number(dataPunt.temp) + Number(data.controller);
    dataPunt.time = moment().format(' h:mm:ss ');

    updateGraph(dataPunt)

  });
