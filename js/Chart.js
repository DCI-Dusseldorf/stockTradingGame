export default class Chart {
  renderChart(data) {
    Highcharts.stockChart("chart-container", {
      chart: {
        type: "spline",
      },
      rangeSelector: {
        selected: 1,
      },

      title: {
        text: data["companyName"],
      },

      series: [
        {
          name: data["companyName"],
          data: data["dataSet"],
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    });
  }
}
