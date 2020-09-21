export default class Chart {
  constructor() {
    this.data = [];
    this.symbol = '';
  }

  getData(stock) {
    const chartData = [];

    for (let i = 0; i < stock.data.t.length; i++) {
      chartData.push([stock.data.t[i] * 1000, stock.data.c[i]]);
    }
    this.data = chartData;
    this.symbol = stock.symbol;
    this.companyName = stock.companyName;
  }

  renderChart() {
    Highcharts.stockChart('chart-container', {
      chart: {
        type: 'spline',
      },
      rangeSelector: {
        selected: 1,
      },

      title: {
        text: this.companyName,
      },

      series: [
        {
          name: this.symbol,
          data: this.data,
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    });
  }
}
