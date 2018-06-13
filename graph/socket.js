var socket = require('socket.io');
var dataPunt = require('./data').dataPoint;
var logData = require('./data').logData;
var moment = require('moment');
var functionTemp = require('./functionTemp');
var ets = require('../knx.js').ets
var con = require('../knx.js').connection
var server = require('./server.js').server

var test = false;     //true if no knx is availeble

function storePoint(data){
  //ctreate new object and store this in logData array
  //console.log(data)
  var help = new Object()
  help.time = data.time             //issue undefined
  help.temp = data.temp

  help.pi_heat = data.pi_heat
  help.pi_cool = data.pi_cool
  help.pi_heat_2 = data.pi_heat
  help.pi_cool_2 = data.pi_cool

  help.sp = data.sp

  help.heat_act = data.heat_act
  help.cool_act = data.cool_act

  logData.dataPoints[logData.dataPoints.length] = help
}

function updateGraph(data){
    io.emit('new-graph-data', data)
    storePoint(data)
  }

var io = socket(server);
io.on('connection', (socket) => {

  console.log('made socket connection', socket.id);



function ldexp(mantissa, exponent) {
   return exponent > 1023 // avoid multiplying by infinity
        ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
        : exponent < -1074 // avoid multiplying by zero
        ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
        : mantissa * Math.pow(2, exponent);
}


//----used for input fields----//
    socket.on('hvac-data', function(data){
      var inp = parseInt(data.inp);
      var id = parseInt(data.id);
        switch (id){
          case 0:   //new temperature
            temp = parseFloat(data.inp).toFixed(2)
            console.log('Temp: ' +  temp);
            if(!test){ets.ext_temp.write(temp);}

            dataPunt.temp = temp;
            dataPunt.time = moment();
            updateGraph(dataPunt)
            io.emit('updateInpDOM', {inp: dataPunt.temp, id:1})
          break;
          case 1:   //new setpoint
            console.log('comfort heat: ' + inp);
            if(!test){
              ets.comf.write(inp);}
            if(test){
              dataPunt.sp = inp;
              dataPunt.time = moment();
              updateGraph(dataPunt)
            }
          break;
          case 2:   //new SP mode
          //1 = comf, 2 = stdby, 3 = eco, 4 = protect
            console.log("SP mode: " + inp)
            if(!test){ets.mode.write(inp);}
          break;
          case 3:   //new thermo mode
          //0 = auto, 1 = coolOnly, 2 = heatOnl
            console.log("Thermo mode: " + inp)
            if(!test){ets.hc_mode.write(inp);}
            //io.emit('updateInpDOM', {inp: inp, id:3})      //test!! thermo mode = id 3
          break;
          case 10: //delete all data
            console.log("delete all graph data");

            data = logData.dataPoints[0];
            logData.dataPoints.length = 0;
            //update graph
            data.time = moment();
            updateGraph(data);
          break;
        }
    })


///////////////////////////////////OLD///////////////////////////////////////////
///////////////////////////////////OLD///////////////////////////////////////////
///////////////////////////////////OLD///////////////////////////////////////////
///////////////////////////////////OLD///////////////////////////////////////////
///////////////////////////////////OLD///////////////////////////////////////////


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
            dataPunt.time = moment();
            updateGraph(dataPunt)
            }
          break;
        case 5:
          console.log('standby heat: ' + inp);
          break;
        case 6:
          console.log('eco heat: ' + inp);


//test eco heat//
          con.read("0/0/7", (src, responsevalue) => {
            var buf = responsevalue

            var sign     =  buf[0] >> 7;
            var exponent = (buf[0] & 0b01111000) >> 3;
            var mantissa = 256 * (buf[0] & 0b00000111) + buf[1];


          console.log(ldexp((0.01*mantissa), exponent));

         });
//test//


}   //end switch

}); //end setpoints

// ext temperature
// send to KNX and update graph


    socket.on('input_temp', function(data){
      temp = parseFloat(data.inp).toFixed(2)
      console.log('sp: ' +  temp);
      if(!test){ets.ext_temp.write(temp);}

      dataPunt.temp = temp;
      dataPunt.time = moment();
      updateGraph(dataPunt)
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

    socket.on('script', function(data){
      console.log(data)

//
var id = parseInt(data.id);
switch (id){
case 1:
  if (functionTemp.timer.isStopped()) {
    console.log('start timer');
    functionTemp.timer.start();
  } else {
    console.log('stop timer');
    functionTemp.timer.stop();
  }

  break;
case 2:
  console.log('delete')
  //logData.dataPoints.splice(0, logData.dataPoints.length-1)

  updateGraph(test)

  break;
}
//


    });


  });   //io.on socket end

  ///////////////////////////////////////////
  ///////////////////KNX EVENTS//////////////
  ///////////////////////////////////////////

  ///////////////////update Input DOM////////////////////

//setpoint mode is updated by knx
ets.mode_fb.on('change', function (oldvalue, newvalue) {
    //1 = comf, 2 = stdby, 3 = eco, 4 = protect
    io.emit('updateInpDOM', {inp: newvalue, id:2})
    console.log("TEMP MODE changed to " + newvalue)
});

// heat/cool/auto mode is updated by knx
ets.hc_mode_fb.on('change', function (oldvalue, newvalue) {
    //0 = auto, 1 = coolOnly, 2 = heatOnly
    io.emit('updateInpDOM', {inp: newvalue, id:3})
    console.log("HVAC MODE changed to " + newvalue)
});



  //--------------------setpoints--------------------------//

ets.act_setpoint.on('change', function (oldvalue, newvalue) {
    console.log("KNX SP: value: %j °C", newvalue);

    dataPunt.sp = parseFloat(newvalue).toFixed(2);
    dataPunt.time = moment();
    updateGraph(dataPunt)

    //give the sp input an update
    io.emit('updateInpDOM', {inp: dataPunt.sp, id:1})
    });


  //----------------listen to KNX for PI or PWM ---------------------//
//PI HEAT//
ets.output_pi_heat.on('change', function (oldvalue, newvalue) {
    console.log("KNX PI: value: %j %", newvalue);

    dataPunt.pi_heat = newvalue.toFixed(2);
    dataPunt.time = moment();
    updateGraph(dataPunt)
  });

//PI HEAT//
ets.output_pi_heat_2.on('change', function (oldvalue, newvalue) {
    console.log("KNX PI 2nd stage: value: %j %", newvalue);

    dataPunt.pi_heat_2 = newvalue.toFixed(2);
    dataPunt.time = moment();
    updateGraph(dataPunt)
  });

//PWM HEAT//
ets.output_pwm_heat.on('change', function (oldvalue, newvalue) {
    newvalue = newvalue ? 1 : 0;
    console.log("KNX PWM: value: %j", newvalue);

    dataPunt.pi_heat = newvalue * 100;
    dataPunt.time = moment();
    updateGraph(dataPunt)
  });

//PI COOL//
ets.output_pi_cool.on('change', function (oldvalue, newvalue) {
    console.log("KNX PI: value: %j %", newvalue);

    dataPunt.pi_cool = newvalue;
    dataPunt.time = moment();
    updateGraph(dataPunt)
  });

//PI COOL 2nd stage//
ets.output_pi_cool_2.on('change', function (oldvalue, newvalue) {
    console.log("KNX PI 2nd: value: %j %", newvalue);

    dataPunt.pi_cool_2 = newvalue;
    dataPunt.time = moment();
    updateGraph(dataPunt)
  });


//PWM COOL//
ets.output_pwm_cool.on('change', function (oldvalue, newvalue) {
    newvalue = newvalue ? 1 : 0;
    console.log("KNX PWM: value: %j", newvalue);

    dataPunt.pi_cool = newvalue * 100;
    dataPunt.time = moment();
    updateGraph(dataPunt)
  });

//HEAT and COOL active//
ets.heat_act.on('change', function (oldvalue, newvalue) {
  console.log('old: ' + dataPunt.heat_act)
  console.log('new: ' + newvalue)
    newvalue = newvalue ? 1 : 0;
    oldvalue = dataPunt.heat_act ? 1 : 0;

    if(!newvalue){
      if(newvalue !== oldvalue){
        dataPunt.heat_act = 1;
        dataPunt.time = moment();
        updateGraph(dataPunt)
        dataPunt.heat_act = null;
        dataPunt.time = moment().add({seconds:0.01});
        updateGraph(dataPunt)

      }else{
        dataPunt.heat_act = null;
        dataPunt.time = moment();
        updateGraph(dataPunt)
      }

    }else{
      dataPunt.heat_act = newvalue;
      dataPunt.time = moment();
      updateGraph(dataPunt)
    }
})

ets.cool_act.on('change', function (oldvalue, newvalue) {
console.log('old: ' + dataPunt.cool_act)
console.log('new: ' + newvalue)

    newvalue = newvalue ? 1 : 0;
    oldvalue = dataPunt.cool_act ? 1 : 0;

    if(!newvalue){
      if(newvalue !== oldvalue){
        dataPunt.cool_act = 1;
        dataPunt.time = moment();
        updateGraph(dataPunt)
        dataPunt.cool_act = null;
        dataPunt.time = moment().add({seconds:0.01});
        updateGraph(dataPunt)

      }else{
        dataPunt.cool_act = null;
        dataPunt.time = moment();
        updateGraph(dataPunt)
      }

    }else{
      dataPunt.cool_act = newvalue;
      dataPunt.time = moment();
      updateGraph(dataPunt)
    }
})


// functions
//automate the room temperature
functionTemp.func.on('deltatemp', function(data){
    console.log('deltatemp ontvangen: ' + data.controller)
    console.log( Number(dataPunt.temp))
    if(!test){ets.ext_temp.write(dataPunt.temp);}
    dataPunt.temp = Number(dataPunt.temp) + Number(data.controller);
    dataPunt.time = moment();
    updateGraph(dataPunt)
  });
