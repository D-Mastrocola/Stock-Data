import React, { Component } from 'react';
import Chart from "react-google-charts";
let yearInSecs = 31_536_000;
let dateTo = Math.floor(Date.now() / 1000);
let dateFrom = Math.floor(Date.now() / 1000) - yearInSecs;


class Stock extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: this.props.name,
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

    request.open('GET', 'https://finnhub.io/api/v1/stock/candle?symbol=' + this.state.ticker + '&resolution=W&from=' + dateFrom + '&to=' + dateTo + '&token=buc39mf48v6oa2u4eqvg');
    request.send();
    request.onload = function () {
      let data = JSON.parse(this.response);

      console.log(data)
      for (let i = 0; i < data.t.length; i++) {
        let date = new Date(data.t[i] * 1000);
        tempData.push([date, parseFloat(data.l[i]), parseFloat(data.o[i]), parseFloat(data.c[i]), parseFloat(data.h[i])]);
      }
      console.log(tempData)
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
  render() {
    console.log('ready')
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
          <div className={this.state.graphID}>
            <Chart
              width={'100%'}
              height={600}
              chartType='CandlestickChart'
              loader={<div>Loading Chart</div>}
              data={this.state.chartData}
              options={{
                legend: 'none',
                candlestick: {
                  fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                  risingColor: { strokeWidth: 0, fill: '#0f9d58' }, // green
                }
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
          <div>Fetching data from API</div>
        </div>

      )
  }

}
export default Stock;