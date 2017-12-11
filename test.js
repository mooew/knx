var londonTempData = {
    city: 'London',
    unit: 'celsius',
    dataPoints: [




    ]
  }


  var data1 = {
    time: 30,
    sp: 14,
    temp: 18,
  }

  var data2 = {
    time: 80,
    sp: 12,
    temp: 18,
  }

londonTempData.dataPoints[londonTempData.dataPoints.length] = data1
londonTempData.dataPoints[londonTempData.dataPoints.length] = data2


  console.log(londonTempData.dataPoints[0])
  console.log(londonTempData.dataPoints[1])
  console.log(londonTempData.dataPoints[2])
  console.log(londonTempData.dataPoints[3])
