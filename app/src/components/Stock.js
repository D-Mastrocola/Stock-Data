import React, { Component } from 'react';
import CanvasJSReact from '../canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints = [];

class Stock extends Component {
  render() {
    const options = {
      theme: 'light2',
      title: {
        text: "AAPL",
        fontFamily: "times new roman"
      },
      height: 400,
      zoomEnabled: true,
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
          risingColor: "#327a0c",
          fallingColor: "#d21921",
          color: "#666",
          dataPoints: dataPoints
        }
      ]
    }
    return (
      <div className='stock' id>
        <div className='stock-info-container'></div>
        <div className='graph-container'>
          <CanvasJSChart options={options}
            onRef={ref => this.chart = ref}
          />
        </div>
      </div>
    );
  }
  realDate(utcDate) {
    //Formats it in milliseconds
    let date = new Date(utcDate * 1000);
    return (date);
  }
  componentDidMount() {
    let request = new XMLHttpRequest()
    var chart = this.chart;
    let yearInSecs = 31_536_000;
    let dateTo = Math.floor(Date.now() / 1000);
    let dateFrom = Math.floor(Date.now() / 1000) - yearInSecs;

    request.open('GET', 'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=' + dateFrom + '&to=' + dateTo + '&token=buc39mf48v6oa2u4eqvg')
    request.send();
    request.onload = function () {
      let data = JSON.parse(this.response);
      console.log(data.t)
      for (let i = 0; i < data.t.length; i++) {
        let date = new Date(data.t[i] * 1000);
        dataPoints.push({ x: date, y: [data.o[i], data.h[i], data.l[i], data.c[i]] })
        chart.render();
      }
      chart.render();
      console.log(dataPoints);
    }

  }
}
export default Stock;