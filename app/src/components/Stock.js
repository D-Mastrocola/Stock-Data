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
      zoomEnabled: true,
      axisY: {
        includeZero: false,
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
          dataPoints: dataPoints
        }
      ]
    }
    return (
      <div className='stock'>
        <div className='stock-card'>
           <h2>AAPL</h2>
           <ul className='stock-info-container'>
             <li className='stock-info'>Price: </li>
             <li className='stock-info'>High:</li>
             <li className='stock-info'>Low:</li>
             <li className='stock-info'>Open:</li>
             <li className='stock-info'>Previous Close:</li>
             <li className='stock-info'><img className='down-arrow' src='./images/down-arrow.svg' /></li>
           </ul>
        </div>
        <div className='graph-container'>
          <CanvasJSChart options={options}
            onRef={ref => this.chart = ref}
          />
        </div>
      </div>
    );
  }
  componentDidMount() {
    let request = new XMLHttpRequest()
    var chart = this.chart;
    let yearInSecs = 31_536_000/2;
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
      }
      chart.render();
      console.log(dataPoints);
    }

  }
}
export default Stock;