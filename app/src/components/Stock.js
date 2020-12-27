import React, { Component } from 'react';
import CanvasJSReact from '../canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints = [];

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.name,
      ticker: this.props.ticker,
      priceID: 'stock-price-' + this.props.ticker,
      highID: 'stock-high-' + this.props.ticker,
      lowID: 'stock-low-' + this.props.ticker,
      openID: 'stock-open-' + this.props.ticker,
      previousCloseID: 'stock-previous-close-' + this.props.ticker,
      dropDownID: 'stock-drop-down-' + this.props.ticker,
    };
  }
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
             <li className='stock-info' id={this.state.priceID}>Price: </li>
             <li className='stock-info' id={this.state.highID}>High:</li>
             <li className='stock-info' id={this.state.lowID}>Low:</li>
             <li className='stock-info' id={this.state.openID}>Open:</li>
             <li className='stock-info' id={this.state.previousCloseID}>Previous Close:</li>
             <li className='stock-info' id={this.state.dropDownID}><img className='down-arrow' src='./images/down-arrow.svg' /></li>
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


    request.open('GET', 'https://finnhub.io/api/v1/quote?symbol=AAPL&token=buc39mf48v6oa2u4eqvg')
    request.send();
    request.onload = function () {
      let data = JSON.parse(this.response);

      let price = document.getElementById("stock-price-AAPL");
      price.innerHTML = 'Price: ' + data.c;

      let high = document.getElementById("stock-high-AAPL");
      high.innerHTML = 'High: ' + data.h;

      let low = document.getElementById("stock-low-AAPL");
      low.innerHTML = 'Low: ' + data.l;

      let open = document.getElementById("stock-open-AAPL");
      open.innerHTML = 'Open: ' + data.o;

      let previousClose = document.getElementById("stock-previous-close-AAPL");
      previousClose.innerHTML = 'Close: ' + data.o;
      console.log(data);

    }
    request = new XMLHttpRequest();
    request.open('GET', 'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=' + dateFrom + '&to=' + dateTo + '&token=buc39mf48v6oa2u4eqvg');
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