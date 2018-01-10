var   temp = 20,
      time = null,
      pi_heat = null,
      pi_cool = null,
      pi_heat_2 = null,
      pi_cool_2 = null,
      sp = null;

var dataPoint = {
  temp: temp,
  time: time,
  pi_heat: pi_heat,
  pi_cool: pi_cool,
  pi_heat_2: pi_heat_2,
  pi_cool_2: pi_cool_2,
  sp: sp
}

var logData = {
    dataPoints: []
  }

module.exports.dataPoint = dataPoint;
module.exports.logData = logData;
