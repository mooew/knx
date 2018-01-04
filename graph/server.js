//test
var express = require('express');

var path = require('path');
var bodyParser = require('body-parser');
var dataPunt = require('./data').dataPoint;
var logData = require('./data').logData;
var ets = require('../knx.js').ets


//App setup
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//API//
app.get('/getTemperature', function(req,res){
  res.send(logData);
  console.log('/getTemperature: ')
});

//------------------------------------//
//update PI throug http GET request//
//------------------------------------//

app.get('/addPI', function(req,res){

  var pih = parseInt(req.query.pih);
  var pic = parseInt(req.query.pic);
  console.log('pi heat: ' + pih)
  console.log('pi cool: ' + pic)
  //var temp = parseInt(req.query.temperature);
  //var time = parseInt(req.query.time);
//  if(temp && time && !isNaN(temp) && !isNaN(time)){
  if(!isNaN(pih)){
    dataPunt.pi = pih;
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
    dataPunt.pi_cool = pic;
    ets.output_pi_cool.emit('change', '5', pic)
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
