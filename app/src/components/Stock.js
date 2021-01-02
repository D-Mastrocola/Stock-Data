import React, { Component } from 'react';
import Chart from "react-google-charts";
let yearInSecs = 31_536_000;
let dateTo = Math.floor(Date.now() / 1000);
let dateFrom = Math.floor(Date.now() / 1000) - yearInSecs;
let resolution = 'W';


class Stock extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
      ticker: this.props.ticker,
      priceID: 'stock-price-' + this.props.ticker,
      highID: 'stock-high-' + this.props.ticker,
      lowID: 'stock-low-' + this.props.ticker,
      openID: 'stock-open-' + this.props.ticker,
      previousCloseID: 'stock-previous-close-' + this.props.ticker,
      dropDownID: 'stock-drop-down-' + this.props.ticker,
      graphID: 'graph-container-' + this.props.ticker,
      chartData: [],
      dataLoadingStatus: 'loading'
    }
  }
  componentDidMount() {
    console.log('mount')
    let request = new XMLHttpRequest();
    const price = document.getElementById(this.state.priceID);
    const high = document.getElementById(this.state.highID);
    const low = document.getElementById(this.state.lowID);
    const open = document.getElementById(this.state.openID);
    const previousClose = document.getElementById(this.state.previousCloseID);
    let tempData = [['day', 'open', 'high', 'low', 'close']];
    let loadState = 'loading';
    let data;
    request.open('GET', 'https://finnhub.io/api/v1/quote?symbol=' + this.state.ticker + '&token=buc39mf48v6oa2u4eqvg')
    request.send();
    request.onload = function () {
      data = JSON.parse(this.response);
      price.innerHTML = 'Price: ' + data.c;
      high.innerHTML = 'High: ' + data.h;
      low.innerHTML = 'Low: ' + data.l;
      open.innerHTML = 'Open: ' + data.o;
      previousClose.innerHTML = 'Close: ' + data.o;
    }
    request = new XMLHttpRequest();
    request.open('GET', 'https://finnhub.io/api/v1/stock/metric?symbol=' + this.state.ticker + '&metric=all&token=buc39mf48v6oa2u4eqvg');
    request.send();
    request.onload = function () {
      data = JSON.parse(this.response);
      console.log(data);
    }


    request = new XMLHttpRequest();

    request.open('GET', 'https://finnhub.io/api/v1/stock/candle?symbol=' + this.state.ticker + '&resolution=' + resolution + '&from=' + dateFrom + '&to=' + dateTo + '&token=buc39mf48v6oa2u4eqvg');
    request.send();
    request.onload = function () {
      let data = JSON.parse(this.response);
      console.log(data)
      for (let i = 0; i < data.t.length; i++) {
        let date = new Date(data.t[i] * 1000);
        tempData.push([date, parseFloat(data.l[i]), parseFloat(data.o[i]), parseFloat(data.c[i]), parseFloat(data.h[i])]);
      }
      loadState = 'ready';
      setState();
    }
    let setState = () => {
      this.setState({
        dataLoadingStatus: loadState,
        chartData: tempData
      })
    }

  }
  changeTimeFrame(time) {
    dateTo = Math.floor(Date.now() / 1000);
    this.setState({
      dataLoadingStatus: 'loading'
    });
    if(time === '1W') {
      dateFrom = dateTo - 604_800;
      resolution = '60'
    }
    if(time === '1M') {
      dateFrom = dateTo - yearInSecs / 12;
      resolution = 'D'
    }
    if(time === '6M') {
      dateFrom = dateTo - yearInSecs / 2;
      resolution = 'W'
    }
    if(time === '1Y') {
      dateFrom = dateTo - yearInSecs;
      resolution = 'W'
    }
    if(time === '5Y') {
      dateFrom = dateTo - yearInSecs * 5;
      resolution = 'M'
    }
    this.componentDidMount()
    
    console.log('changed time frame')
  }
  render() {
    console.log('render');
    return this.state.dataLoadingStatus === 'ready' ? (
      <div className='stock'>
        <div className='stock-card'>
          <h2>{this.state.ticker}</h2>
          <ul className='stock-info-container'>
            <li className='stock-info' id={this.state.priceID}>Price: </li>
            <li className='stock-info' id={this.state.highID}>High:</li>
            <li className='stock-info' id={this.state.lowID}>Low:</li>
            <li className='stock-info' id={this.state.openID}>Open:</li>
            <li className='stock-info' id={this.state.previousCloseID}>Previous Close:</li>
          </ul>
        </div>
        <div className='graph-container'>
          <div className='chart-container' id={this.state.graphID}>
            <div className='timeframe-container'>
              <ul className='timeframe-list'>
                <li onClick={() => this.changeTimeFrame('1W')}>1W</li>
                <li onClick={() => this.changeTimeFrame('1M')}>1M</li>
                <li onClick={() => this.changeTimeFrame('6M')}>6M</li>
                <li onClick={() => this.changeTimeFrame('1Y')}>1Y</li>
                <li onClick={() => this.changeTimeFrame('5Y')}>5Y</li>
              </ul>
            </div>
            <Chart
              width={'100%'}
              height={800}
              chartType='CandlestickChart'
              loader={<div>Loading Chart</div>}
              data={this.state.chartData}
              options={{
                legend: 'none',
                candlestick: {
                  fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                  risingColor: { strokeWidth: 0, fill: '#0f9d58' }, // green
                },
                crosshair: { trigger: 'both' }
              }}
            />
          </div>
        </div>
      </div>
    ) : (
        <div className='stock'>
          <div className='stock-card'>
            <h2>{this.state.ticker}</h2>
            <ul className='stock-info-container'>
              <li className='stock-info' id={this.state.priceID}>Price: </li>
              <li className='stock-info' id={this.state.highID}>High:</li>
              <li className='stock-info' id={this.state.lowID}>Low:</li>
              <li className='stock-info' id={this.state.openID}>Open:</li>
              <li className='stock-info' id={this.state.previousCloseID}>Previous Close:</li>
            </ul>
          </div>
          <div className='graph-container'>
            <div className='chart-container' id={this.state.graphID}>Fetching data from API</div>
          </div>
        </div>

      )
  }

}
export default Stock;