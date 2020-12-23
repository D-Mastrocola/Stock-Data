let request = new XMLHttpRequest();
// Unix time stamp in seconds Math.floor(Date.now() / 1000)
let yearInSecs = 31_536_000;
let dateTo = Math.floor(Date.now() / 1000);
let dateFrom = Math.floor(Date.now() / 1000) - yearInSecs;
let chartData;

let getData = () => {
  request.open('GET', 'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=' + dateFrom + '&to=' + dateTo + '&token=buc39mf48v6oa2u4eqvg')
  request.send();
};

request.onload = function () {
  // Begin accessing JSON data here
  let data = JSON.parse(this.response)
  console.log(data);
  let points = [];
  for (let i = 0; i < data.t.length; i++) {
    points.push({ x: realDate(data.t[i]), y: [data.o[i], data.h[i], data.l[i], data.c[i]] })
  }
  chartData = {
    title: 'AAPL',
    chartPoints: points
  };
  console.log(chartData.title);
  createChart();
}



let realDate = (utcDate) => {
  //Formats it in milliseconds
  let date = new Date(utcDate * 1000);
  return(date);
}



let createChart = () => {
  var chart = new CanvasJS.Chart("chartContainer",
    {
      theme: 'dark2',
      title: {
        text: chartData.title,
        fontFamily: "times new roman"
      },
      zoomEnabled: true,
      exportEnabled: true,
      axisY: {
        includeZero: false,
        title: "Prices",
        prefix: "$ "
      },
      axisX: {
        interval: 2,
        intervalType: "month",
        valueFormatString: "MMM-YY",
        labelAngle: -45
      },
      data: [
        {
          type: "candlestick",
          risingColor: "green",
          color: "red",
          dataPoints: chartData.chartPoints
        }
      ]
    });
  chart.render();
}

