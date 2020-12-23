import React, { Component } from 'react';
import CanvasJS from "../canvasjs.min";
class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: this.props.ticker,
      id: "stock-" + this.props.ticker
    }
  }

  render() {
    return (
      <div className='stock' id={this.state.ticker} >
        <button onClick={() => this.getData()}>Get Data</button>
      </div>
    )

  }
  getData() {
    let request = new XMLHttpRequest()
    let yearInSecs = 31_536_000;
    let dateTo = Math.floor(Date.now() / 1000);
    let dateFrom = Math.floor(Date.now() / 1000) - yearInSecs;
    let chartData;
    request.open('GET', 'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=' + dateFrom + '&to=' + dateTo + '&token=buc39mf48v6oa2u4eqvg')
    request.send();
    request.onload = function () {
      // Begin accessing JSON data here
      let data = JSON.parse(this.response);
      let points = [];
      for (let i = 0; i < data.t.length; i++) {
        points.push({ x: () => this.realDate(data.t[i]), y: [data.o[i], data.h[i], data.l[i], data.c[i]] })
      }
      chartData = {
        title: 'AAPL',
        chartPoints: points
      };
      console.log(chartData);
      let chart = new CanvasJS.Chart('AAPL',
        {
          theme: 'dark2',
          title: {
            text: chartData.title,
            fontFamily: "times new roman"
          },
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
              risingColor: "green",
              color: "red",
              dataPoints: chartData.chartPoints
            }
          ]
        });
      chart.render();
    }
  }
  /*componentDidMount(){
		var chart = this.chart;
		fetch('https://canvasjs.com/data/gallery/react/microsoft-stock-price.json')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			for (var i = 0; i < data.length; i++) {
				dataPoints.push({
					x: data[i].x,
					y: data[i].y
				});
			}
			chart.render();
		});
	}*/

  realDate(utcDate) {
    //Formats it in milliseconds
    let date = new Date(utcDate * 1000);
    return (date);
  }
}

export default Stock;