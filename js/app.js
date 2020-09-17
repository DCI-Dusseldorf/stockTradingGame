// THE DEFAULT CHART IS JUST FOR DEMO PURPOSED
// START EDIT YOUR JS FILE FROM HERE

Highcharts.getJSON(
  'https://demo-live-data.highcharts.com/aapl-c.json',
  function (data) {
    // Create the chart
    Highcharts.stockChart('chart-container', {
      chart: {
        type: 'spline',
      },
      rangeSelector: {
        selected: 1,
      },

      title: {
        text: 'AAPL Stock Price',
      },

      series: [
        {
          name: 'AAPL',
          data: data,
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    });
  }
);
//