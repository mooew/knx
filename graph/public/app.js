// Using IIFE for Implementing Module Pattern to keep the Local Space for the JS Variables
(function() {
  var socket = io.connect('http://192.168.2.220:9000');


  // Query DOM
  var   dim = document.getElementById('dimV'),
        btn = document.getElementById('send'),
        heat = document.getElementById('button_heat'),
        cool = document.getElementById('button_cool'),
        reset = document.getElementById('reset'),

        input_1 = document.getElementById('in1'),
        send_1 = document.getElementById('send1'),
        input_2 = document.getElementById('in2'),
        send_2 = document.getElementById('send2'),

        button_1 = document.getElementById('b1'),
        button_2 = document.getElementById('b2'),
        button_3 = document.getElementById('b3'),
        button_4 = document.getElementById('b4');

        reset.addEventListener('click', function(){
          console.log('reset zoom');
          weatherChartRef.resetZoom();
        });

        // Emit events

        btn.addEventListener('click', function(){
          console.log('button pressed');
          socket.emit('trigger', {
              dim: dim.value
          });

        });

        send_1.addEventListener('click', function(){
          console.log('button pressed');
          socket.emit('input', {
              inp: input_1.value
          });
          });

          send_2.addEventListener('click', function(){
            console.log('button pressed');
            socket.emit('input', {
                inp: input_2.value
            });

        });
/*
        heat.addEventListener('click', function(){
          console.log('button pressed');
          socket.emit('mode', {mode: 1});
        });

        cool.addEventListener('click', function(){
          console.log('button pressed');
          socket.emit('mode', {mode: 0});
        });
        */
//--------------------buttons-----------------------------------//
        button_1.addEventListener('click', function(){
          console.log('button pressed');
          socket.emit('mode', {mode: 1});
        });
        button_2.addEventListener('click', function(){
          console.log('button pressed');
          socket.emit('mode', {mode: 2});
        });
        button_3.addEventListener('click', function(){
          console.log('button pressed');
          socket.emit('mode', {mode: 3});
        });
        button_4.addEventListener('click', function(){
          console.log('button pressed');
          socket.emit('mode', {mode: 4});
        });
//-------------------------------------------------------------//

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;



    var serverUrl = "/",
        members = [],
        pusher = new Pusher('95be360cf53aab13f769', {
          cluster: 'eu',
        encrypted: true
       }),

        channel,weatherChartRef,
        timeFormat = 'h:mm:ss';



    function showEle(elementId){
      document.getElementById(elementId).style.display = 'flex';
    }

    function hideEle(elementId){
      document.getElementById(elementId).style.display = 'none';
    }

    function ajax(url, method, payload, successCallback){
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) return;
        successCallback(xhr.responseText);
      };
      xhr.send(JSON.stringify(payload));
    }


   function renderWeatherChart(weatherData) {
     //take the canvas from the html file
      var ctx = document.getElementById("weatherChart").getContext("2d");

      var options = {
        responsive: true,
        elements: {
						rectangle: {
							borderWidth: 2,
							borderColor: 'rgb(0, 255, 0)',
							borderSkipped: 'bottom'
						}
					},
                      title:{
                          text: "Chart.js Time Scale"
                      },
              scales: {
                xAxes: [{
                  type: "time",
                  distribution: 'series',
                  time: {
                    format: timeFormat,
                    // round: 'day'
                    tooltipFormat: 'h:mm:ss'
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Date'
                  }
                }, ],
                yAxes: [{
                  //y-as 1
                  position: "left",
                  id: "y-axis-1",
                  scaleLabel: {
                    display: true,
                    labelString: 'value'
                  },
                  ticks: {
                    suggestedMin: 10,
                    suggestedMax: 30
                }
              },{
                //y-as 2
                position: "right",
                id: "y-axis-2",
                // grid line settings
                gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
                scaleLabel: {
                  display: true,
                  labelString: 'value'
                },
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 100
              }

              }]
              },
        // Container for pan options
        pan: {
            // Boolean to enable panning
            enabled: true,

            // Panning directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow panning in the y direction
            mode: 'x'
        },

          // Container for zoom options
        zoom: {
            // Boolean to enable zooming
            enabled: true,
            //drag: true,

            // Zooming directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow zooming in the y direction
            mode: 'x',
        }




                    };


      weatherChartRef = new Chart(ctx, {
        type: "line",
        data: weatherData,            //parsed into chartConfig
        options: options
      });
  }

        var chartConfig = {
        labels: [],                   //x-axes
        datasets: [
            {
                label: "setpoint",
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 3,
                pointHitRadius: 10,
                data: [],           //y-axes
                spanGaps: true,
                steppedLine: true,
                yAxisID: "y-axis-1",


            },
            {
                label: "PI",
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(75,75,192,0.4)",
                borderColor: "rgba(75,75,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 3,
                pointHitRadius: 10,
                data: [],         //here comes the data
                spanGaps: true,
                steppedLine: true,
                yAxisID: "y-axis-2",

            },

        ]
    };

  ajax("/getTemperature", "GET",{}, onFetchTempSuccess);
  console.log('there was an ajax get request for all data');

  function onFetchTempSuccess(response){      //callback function after ajax get wit JSON data
    hideEle("loader");  //hide loading status
    var respData = JSON.parse(response);
   //store chartConfig.labels = respData.dataPoints.map(dataPoint => dataPoint.time);
   //store chartConfig.datasets[0].data = respData.dataPoints.map(dataPoint => dataPoint.temperature);
   //store chartConfig.datasets[1].data = respData.dataPoints.map(dataPoint => dataPoint.temperature);
//comment because after refresh data is mixed
//now after refresh everything is gone

    renderWeatherChart(chartConfig)
    //now graph is visible after reloading!!
  }

  channel = pusher.subscribe('london-temp-chart');
  //action on new event!?

/*
  channel.bind('new-temperature', function(data) {
    var newTempData = data.dataPoint;
    //console.log(data);
    //alert('An event was triggered with message: ' + data.dataPoint);
    /*
    if(weatherChartRef.data.labels.length > 30){
      weatherChartRef.data.labels.shift();
      weatherChartRef.data.datasets[0].data.shift();
      weatherChartRef.data.datasets[1].data.shift();
    }

    console.log('update');
    while(weatherChartRef.data.datasets[0].data.length < weatherChartRef.data.labels.length){
    weatherChartRef.data.datasets[0].data.push(null);
    };
    weatherChartRef.data.labels.push(newTempData.time);
    weatherChartRef.data.datasets[0].data.push(newTempData.temperature);
    weatherChartRef.update();
    console.log(weatherChartRef.data.datasets[0].data);
  });

  channel.bind('new-temperature1', function(data) {
    var newTempData = data.dataPoint;
    // if lot sof data scroll the chart
    //console.log(data);
    //alert('An event was triggered with message: ' + data.dataPoint);
    /*
    if(weatherChartRef.data.labels.length > 15){
      weatherChartRef.data.labels.shift();
      weatherChartRef.data.datasets[1].data.shift();
    }

    console.log('update');
    while(weatherChartRef.data.datasets[1].data.length < weatherChartRef.data.labels.length){
    weatherChartRef.data.datasets[1].data.push(null);
    };
    weatherChartRef.data.labels.push(newTempData.time);
    weatherChartRef.data.datasets[1].data.push(newTempData.temperature);
    weatherChartRef.update();
  });
*/
  channel.bind('new-data', function(data) {
    console.log(data);
    var newTempData = data.dataPoint;
    console.log('new data is received');
    weatherChartRef.data.labels.push(newTempData.time);
    weatherChartRef.data.datasets[0].data.push(newTempData.sp);
    weatherChartRef.data.datasets[1].data.push(newTempData.pi);
    weatherChartRef.update();
  });


/* TEMP CODE FOR TESTING */
/*
  var dummyTime = 1500;
  setInterval(function(){
    dummyTime = dummyTime + 10;
    ajax("/addTemperature?temperature="+ getRandomInt(10,20) +"&time="+dummyTime,"GET",{},() => {});
  }, 3000);
console.log("random");

setInterval(function(){
  dummyTime = dummyTime + 10;
  ajax("/addTemperature1?temperature="+ getRandomInt(10,20) +"&time="+dummyTime,"GET",{},() => {});
}, 7500);
console.log("random");


  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
/* TEMP CODE ENDS */

})();
