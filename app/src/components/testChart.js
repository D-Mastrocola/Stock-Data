import React, { Component } from 'react';
import CanvasJSReact from '../canvasjs.react';

google.charts.load('current', { 'packages': ['corechart'] });


class TestChart extends Component {
  render() {
    return (
      <div id='chart_div' onload={() => this.drawChart()}>

      </div >
    )
  }
  drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Mon', 28, 28, 38, 38],
      ['Tue', 38, 38, 55, 55],
      ['Wed', 55, 55, 77, 77],
      ['Thu', 77, 77, 66, 66],
      ['Fri', 66, 66, 22, 22]
      // Treat the first row as data.
    ], true);

    var options = {
      legend: 'none',
      bar: { groupWidth: '100%' }, // Remove space between bars.
      candlestick: {
        fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
        risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
      }
    };
    chart.draw(data, options);
  }
}
export default TestChart;