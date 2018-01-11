var   temp = 20,
      time = null,
      pi_heat = null,
      pi_cool = null,
      pi_heat_2 = null,
      pi_cool_2 = null,
      sp = null,
      heat_act = null,
      cool_act = null;

var dataPoint = {
  temp: temp,
  time: time,
  pi_heat: pi_heat,
  pi_cool: pi_cool,
  pi_heat_2: pi_heat_2,
  pi_cool_2: pi_cool_2,
  sp: sp,
  heat_act: heat_act,
  cool_act: cool_act
}

var logData = {
    dataPoints: []
  }

module.exports.dataPoint = dataPoint;
module.exports.logData = logData;
