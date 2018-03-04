//test
var express = require('express');
var cors = require('cors')

var path = require('path');
var bodyParser = require('body-parser');
var dataPunt = require('./data').dataPoint;
var logData = require('./data').logData;
var etsGA = require('./ets').ets;
var ets = require('../knx.js').ets


//App setup
var app = express();
app.use(cors()) //allow client acces?

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//API//
app.get('/getTemperature', function(req,res){
  res.send(logData.dataPoints);
  console.log('/getTemperature: ')
  console.log(logData.dataPoints)
});

//send and receive ets
app.get('/getEts', function(req,res){
  res.send(etsGA);
  console.log('/getEts: ')
  console.log(etsGA)
});



//------------------------------------//
//update PI throug http GET request//
//------------------------------------//

app.get('/add', function(req,res){

  var pih = parseInt(req.query.pih);
  var pic = parseInt(req.query.pic);
  var pih2 = parseInt(req.query.pih2);
  var pic2 = parseInt(req.query.pic2);
  var sp = parseFloat(req.query.sp).toFixed(1);
  var h = parseInt(req.query.h);
  var c = parseInt(req.query.c);



  console.log('pi heat: ' + pih)
  console.log('pi cool: ' + pic)
  console.log('pi heat 2nd: ' + pih2)
  console.log('pi cool 2nd: ' + pic2)
  console.log('heat: ' + h)
    console.log('cool: ' + c)

  //var temp = parseInt(req.query.temperature);
  //var time = parseInt(req.query.time);
//  if(temp && time && !isNaN(temp) && !isNaN(time)){
  if(!isNaN(pih)){
//    dataPunt.pi = pih;
    //dataPunt.time = moment().format(' h:mm:ss ');

    //updateGraph(dataPunt)
    ets.output_pi_heat.emit('change', '5', pih)



    //logData.dataPoints.push(newDataPoint);         //ad new datapoint to array
    //trigger event event and send newDataPoint
    //pusher.trigger('london-temp-chart', 'new-temperature', {
      //dataPoint: newDataPoint
    //});

    res.send({success:true});

  }else if(!isNaN(pic)){
//    dataPunt.pi_cool = pic;
    ets.output_pi_cool.emit('change', '5', pic)
    res.send({success:true});
  }else if(!isNaN(pih2)){
  //dataPunt.pi_heat_2 = pih2;
  ets.output_pi_heat_2.emit('change', '5', pih2)
  res.send({success:true});
}else if(!isNaN(pic2)){
  //dataPunt.pi_cool_2 = pic2;
  ets.output_pi_cool_2.emit('change', '5', pic2)
  res.send({success:true});
}else if(!isNaN(sp)){
  ets.act_setpoint.emit('change', '5', sp)
  res.send({success:true});
}else if(!isNaN(h)){
  ets.heat_act.emit('change', '5', h)
  res.send({success:true});
}else if(!isNaN(c)){
  ets.cool_act.emit('change', '5', c)
  res.send({success:true});
}else{
    res.send({success:false, errorMessage: 'Invalid Query Paramaters, required - pi.'});
  }
});






// Error Handler for 404 Pages
app.use(function(req, res, next) {
    var error404 = new Error('Route Not Found');
    error404.status = 404;
    next(error404);
});



var server = app.listen(9000, function(){
  console.log('Example app listening on port 9000!')
});

module.exports.app = app;
module.exports.server = server;
