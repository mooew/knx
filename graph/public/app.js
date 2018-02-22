  var socket = io.connect('http://localhost:9000');

  // Query DOM

$(document).ready(function() {


///////////setpoints//////////////////////////////
    $("#sp-6-s").click(function(){
       var sp6 = $('#sp-6').val();
        console.log('sp6 economy heat: ' + sp6);
        socket.emit('input_sp', {inp: sp6, id:6});
    });

    $("#sp-5-s").click(function(){
       var sp5 = $('#sp-5').val();
        console.log('sp5 standby heat: ' + sp5);
        socket.emit('input_sp', {inp: sp5, id:5});
    });

    $("#sp-4-s").click(function(){
       var sp4 = $('#sp-4').val();
        console.log('sp4 comfort heat: ' + sp4);
        socket.emit('input_sp', {inp: sp4, id:4});
    });

    $("#sp-3-s").click(function(){
       var sp3 = $('#sp-3').val();
        console.log('sp3 comfort cool: ' + sp3);
        socket.emit('input_sp', {inp: sp3, id:3});
    });

    $("#sp-2-s").click(function(){
       var sp2 = $('#sp-2').val();
       //var idd = 2;
        console.log('sp2 standby cool: ' + sp2);
        socket.emit('input_sp', {inp: sp2, id:2});
    });

    $("#sp-1-s").click(function(){
       var sp1 = $('#sp-1').val();
       //var idd = 1;
        console.log('sp1 standby cool: ' + sp1);
        socket.emit('input_sp', {inp: sp1, id:1});
    });





    $("#temp-ext-s").click(function(){
       var tempExt = $('#temp-ext').val();
        console.log(tempExt);
        socket.emit('input_temp', {inp: tempExt});
    });

    $("#reset").click(function(){
      weatherChartRef.resetZoom();
    });

    $("#delete").click(function(){
      //socket.emit('script', {id:2});
      weatherChartRef.data.labels.splice(0,5);
      weatherChartRef.data.datasets[0].data.splice(0,5);
      weatherChartRef.data.datasets[1].data.splice(0,5);
      weatherChartRef.data.datasets[2].data.splice(0,5);
      weatherChartRef.data.datasets[3].data.splice(0,5);
      weatherChartRef.data.datasets[4].data.splice(0,5);
      weatherChartRef.data.datasets[5].data.splice(0,5);
      weatherChartRef.data.datasets[6].data.splice(0,5);
      weatherChartRef.data.datasets[7].data.splice(0,5);

      weatherChartRef.update();

    });

    $("#script").click(function(){
      startScript();
      socket.emit('script', {id:1});
    //  console.log('data: ')

    });


///////mode: off heat cool auto///////////////////
    $('#mode input').on('change', function() {
   //alert($('input[name=options]:checked', '#mode').val());
   socket.emit('mode',
    $('input[name=options]:checked', '#mode').val())
    });

////////mode: comfort stdby eco protect////////////
    $('#hvac input').on('change', function() {
   //alert($('input[name=options]:checked', '#hvac').val());
   socket.emit('hvac',
    $('input[name=options]:checked', '#hvac').val())
    });


/////////////////update DOM from the server//////////////

//hvac mode is updated by knx
  socket.on('server-hvac-fb', function(data){
    //select = stringify(data)
    //1 = comf, 2 = stdby, 3 = eco, 4 = protect
    $("#hvac-" + data).prop('checked', true).trigger("click");
  })

// heat/cool/auto mode is updated by knx
socket.on('server-hc-fb', function(data){
  //select = stringify(data)
  //1 = comf, 2 = stdby, 3 = eco, 4 = protect
  $("#mode-" + data).prop('checked', true).trigger("click");
})

socket.on('updateDOM', function(data){
  //var sp = parseInt(data)
  //console.log(sp)
  $("#sp-4").val(data)
})

});




    var serverUrl = "/",
        members = [],
        weatherChartRef,
        timeFormat = 'h:mm:ss';



    function showEle(elementId){
      document.getElementById(elementId).style.display = 'flex';
    }

    function hideEle(elementId){
      document.getElementById(elementId).style.display = 'none';
    }
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
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
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////

////////////////////// SCRIPT ///////////////////////////////////:::
function startScript(){
  console.log('start')
}

////////////////////// GRAFIEK ///////////////////////////////////:::

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
                      tooltips: {
						mode: 'index',
						intersect: true,
					},
          hover: {
						mode: 'index',
						intersect: true
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
                    display: false,
                    labelString: 'Date'
                  }
                }, ],
                yAxes: [{
                  //y-as 1
                  position: "left",
                  id: "y-axis-1",
                  scaleLabel: {
                    display: false,
                    labelString: 'value'
                  },
                  ticks: {
                    suggestedMin: 0,
                    suggestedMax: 30
                }
              },{
                //y-as 2
                position: "right",
                id: "y-axis-2",
                // grid line settings
                gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                    drawBorder: false,
                    display: false,
                },
                scaleLabel: {
                  display: false,
                  labelString: 'value'
                },
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 800,
                  display: false,
              }

              },{
                //y-as 3
                position: "right",
                id: "y-axis-3",
                // grid line settings
                gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                    drawBorder: false,
                    display: false,
                },
                scaleLabel: {
                  display: false,
                  labelString: 'value'
                },
                ticks: {
                  suggestedMin: -102,
                  suggestedMax: 698,
                  display: false,
              }

              },{
                //y-as 4
                position: "right",
                id: "y-axis-4",
                // grid line settings
                gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                    drawBorder: false,
                    display: false,
                },
                scaleLabel: {
                  display: false,
                  labelString: 'value'
                },
                ticks: {
                  suggestedMin: -50,
                  suggestedMax: 250,
                  display: false,
              }

              }
            ]
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
                backgroundColor: "rgba(29,165,24,0.4)",
                borderColor: "rgba(29,165,24,0.4)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(29,165,24,0.4)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(29,165,24,0.4)",
                pointHoverBorderColor: "rgba(29,165,24,0.4)",
                pointHoverBorderWidth: 5,
                pointRadius: 1,
                pointHitRadius: 1,
                data: [],           //y-axes
                spanGaps: true,
                steppedLine: true,
                yAxisID: "y-axis-1",


            },
            {
                label: "temperature",
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(156,107,119,0.4)",
                borderColor: "rgba(156,107,119,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(156,107,119,0.4)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(156,107,119,0.4)",
                pointHoverBorderColor: "rgba(156,107,119,0.4)",
                pointHoverBorderWidth: 5,
                pointRadius: 1,
                pointHitRadius: 1,
                data: [],           //y-axes
                spanGaps: true,
                steppedLine: true,
                yAxisID: "y-axis-1",


            },
            {
                label: "PI heat",
                fill: false,
                lineTension: 0,
                backgroundColor: "#660000",
                borderColor: "#660000",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#660000",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#660000",
                pointHoverBorderColor: "#660000",
                pointHoverBorderWidth: 5,
                pointRadius: 1,
                pointHitRadius: 1,
                data: [],         //here comes the data
                spanGaps: true,
                steppedLine: true,
                yAxisID: "y-axis-2",

            },
            {
                label: "PI cool",
                fill: false,
                lineTension: 0,
                backgroundColor: "#000066",
                borderColor: "#000066",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#000066",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#000066",
                pointHoverBorderColor: "#000066",
                pointHoverBorderWidth: 5,
                pointRadius: 1,
                pointHitRadius: 1,
                data: [],         //here comes the data
                spanGaps: true,
                steppedLine: true,
                yAxisID: "y-axis-3",

            },
            {
                label: "PI heat 2nd",
                fill: false,
                lineTension: 0,
                backgroundColor: "#660000",
                borderColor: "#660000",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#660000",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#660000",
                pointHoverBorderColor: "#660000",
                pointHoverBorderWidth: 5,
                pointRadius: 1,
                pointHitRadius: 1,
                data: [],         //here comes the data
                spanGaps: true,
                steppedLine: true,
                yAxisID: "y-axis-2",

            },
            {
                label: "PI cool 2nd",
                fill: false,
                lineTension: 0,
                backgroundColor: "#000066",
                borderColor: "#000066",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#000066",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#000066",
                pointHoverBorderColor: "#000066",
                pointHoverBorderWidth: 5,
                pointRadius: 1,
                pointHitRadius: 1,
                data: [],         //here comes the data
                spanGaps: true,
                steppedLine: true,
                yAxisID: "y-axis-3",

            },
            {
                label: "heating",
                fill: false,
                lineTension: 0,
                backgroundColor: "#660000",
                borderColor: "#660000",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#660000",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#660000",
                pointHoverBorderColor: "#660000",
                pointHoverBorderWidth: 5,
                pointRadius: 1,
                pointHitRadius: 1,
                data: [],         //here comes the data
                spanGaps: false,
                steppedLine: true,
                yAxisID: "y-axis-4",

            },
            {
                label: "cooling",
                fill: false,
                lineTension: 0,
                backgroundColor: "#000066",
                borderColor: "#000066",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#000066",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#000066",
                pointHoverBorderColor: "#000066",
                pointHoverBorderWidth: 5,
                pointRadius: 1,
                pointHitRadius: 1,
                data: [],         //here comes the data
                spanGaps: false,
                steppedLine: true,
                yAxisID: "y-axis-4",

            },

        ]
    };
//////////////////////////////////////////////////////////////////////////////



  ajax("/getTemperature", "GET",{}, onFetchTempSuccess);
  console.log('there was an ajax get request for all data');

  function onFetchTempSuccess(response){      //callback function after ajax get wit JSON data
    //hideEle("loader");  //hide loading status
    var respData = JSON.parse(response);
    console.log('respData: ' + respData)
    chartConfig.labels = respData.map(dataPoint => dataPoint.time);
    chartConfig.datasets[0].data = respData.map(dataPoint => dataPoint.sp);
    chartConfig.datasets[1].data = respData.map(dataPoint => dataPoint.temp);
    chartConfig.datasets[2].data = respData.map(dataPoint => dataPoint.pi_heat);
    chartConfig.datasets[3].data = respData.map(dataPoint => dataPoint.pi_cool);
    chartConfig.datasets[4].data = respData.map(dataPoint => dataPoint.pi_heat_2);
    chartConfig.datasets[5].data = respData.map(dataPoint => dataPoint.pi_cool_2);
    chartConfig.datasets[6].data = respData.map(dataPoint => dataPoint.heat_act);
    chartConfig.datasets[7].data = respData.map(dataPoint => dataPoint.cool_act);


   renderWeatherChart(chartConfig)
    //now graph is visible after reloading!!
  }


  socket.on('new-graph-data', function(data) {
    console.log(data);
    //var newTempData = data.dataPoint;

  var newTempData = data; //test socket

/*
    if(weatherChartRef.data.labels.length > 3){
      weatherChartRef.data.labels.shift();
      weatherChartRef.data.datasets[0].data.shift();
      weatherChartRef.data.datasets[1].data.shift();
      weatherChartRef.data.datasets[2].data.shift();
      weatherChartRef.data.datasets[3].data.shift();
    }
*/


    console.log('new data is received');
    weatherChartRef.data.labels.push(newTempData.time);
    weatherChartRef.data.datasets[0].data.push(newTempData.sp);
    weatherChartRef.data.datasets[1].data.push(newTempData.temp);
    weatherChartRef.data.datasets[2].data.push(newTempData.pi_heat);
    weatherChartRef.data.datasets[3].data.push(newTempData.pi_cool);
    weatherChartRef.data.datasets[4].data.push(newTempData.pi_heat_2);
    weatherChartRef.data.datasets[5].data.push(newTempData.pi_cool_2);
    weatherChartRef.data.datasets[6].data.push(newTempData.heat_act);
    weatherChartRef.data.datasets[7].data.push(newTempData.cool_act);

    weatherChartRef.update();
    //console.log(weatherChartRef)
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

//})();
