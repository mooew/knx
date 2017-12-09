var dp1 = {
  ga: '0/3/8',
  dpt: 'DPT5.001'
}
console.log(typeof dp1)
var dp2 = {
  ga: '0/3/2',
  dpt: 'DPT9.001'
}

var ets = {dp1, dp2}


console.log(dp1)
console.log(ets)

console.log(ets.dp1.dpt)
for (var key in ets){
  console.log(key)
  console.log(typeof key)

  var obj = ets[key];
  console.log('?: ' + typeof obj)
}


Object.keys(ets).forEach(function(key){
  console.log(key)
  console.log(typeof key)
})
