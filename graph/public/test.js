$(document).ready(function() {
    $("#sp-send").click(function(){
       var sp3 = $('#sp-3').val();
        console.log(sp3);
        socket.emit('input_comf', {inp: sp3});
    });
});

$(document).ready(function() {
    $("#temp-send").click(function(){
       var tempExt = $('#temp-ext').val();
        console.log(tempExt);
        socket.emit('input_temp', {inp: tempExt});
    });
});

$(document).ready(function() {
    $("#reset").click(function(){
      weatherChartRef.resetZoom();
    });
});
