const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create Schema
const EtsSchema = new Schema({
  name: {
    type: String,
    required:[true, 'Name field required']
  },
  ga: {
    type: String
  }
});

const Ets = mongoose.model('ets', EtsSchema);

var ets = [

      {name: "output_pi_heat",  ga: "0/1/1"},
      {name: "output_pwm_heat",  ga: "0/1/2"},
      {name: "output_pi_cool",  ga: "0/1/5"},
      {name: "output_pwm_cool",  ga: "0/1/6"},
      {name: "ext_temp",  ga: "3/0/0"},
      {name: "comf",  ga: "3/4/2"},
      {name: 'act_setpoint',  ga: '3/4/0'},

      {name: 'mode_fb',  ga: '3/3/5'},
      {name: 'mode',  ga: '3/3/4'},

      {name: 'heat_act',  ga: '3/1/6'},
      {name: 'cool_act',  ga: '3/2/7'}



];


module.exports.ets = ets;
//module.exports = Ets;
