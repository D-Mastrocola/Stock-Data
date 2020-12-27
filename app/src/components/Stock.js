import React, { Component } from 'react';
import CanvasJSReact from '../canvasjs.react';

let CanvasJSChart = CanvasJSReact.CanvasJSChart;
let dataPoints = [];

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
      graphID: 'graph-container-' + this.props.ticker
    };
  }
  render() {
    const options = { 
      theme: 'light2',
      title: {
        text: this.state.title,
        fontFamily: "times new roman"
      },
      height: 400,
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
          <h2>{this.state.ticker}</h2>
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
          <CanvasJSChart 
            options={options}
            onRef={ref => this.chart = ref}
          />
        </div>
      </div>
    );
  }
  componentDidMount() {
    let request = new XMLHttpRequest();
    let chart = this.chart;
    let yearInSecs = 31_536_000 / 2;
    let dateTo = Math.floor(Date.now() / 1000);
    let dateFrom = Math.floor(Date.now() / 1000) - yearInSecs;
    let price = document.getElementById(this.state.priceID);
    let high = document.getElementById(this.state.highID);
    let low = document.getElementById(this.state.lowID);
    let open = document.getElementById(this.state.openID);
    let previousClose = document.getElementById(this.state.previousCloseID);
    request.open('GET', 'https://finnhub.io/api/v1/quote?symbol=' + this.state.ticker + '&token=buc39mf48v6oa2u4eqvg')
    request.send();
    request.onload = function () {
      let data = JSON.parse(this.response);
      price.innerHTML = 'Price: ' + data.c;
      high.innerHTML = 'High: ' + data.h;
      low.innerHTML = 'Low: ' + data.l;
      open.innerHTML = 'Open: ' + data.o;
      previousClose.innerHTML = 'Close: ' + data.o;
    }
    request = new XMLHttpRequest();
    console.log(dataPoints)
    request.open('GET', 'https://finnhub.io/api/v1/stock/candle?symbol=' + this.state.ticker + '&resolution=D&from=' + dateFrom + '&to=' + dateTo + '&token=buc39mf48v6oa2u4eqvg');
    request.send();
    request.onload = function () {
      let data = JSON.parse(this.response);
      for (let i = 0; i < data.t.length; i++) {
        let date = new Date(data.t[i] * 1000);
        dataPoints.push({ x: date, y: [data.o[i], data.h[i], data.l[i], data.c[i]] });
      }
      chart.render();
      console.log(dataPoints);
    }
  }
}

export default Stock;