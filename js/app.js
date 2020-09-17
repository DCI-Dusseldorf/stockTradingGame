let service;
if (config.IS_MOCK_DATA) {
  service = new Proxy(new MockFinnHubService());
} else {
  service = new Proxy(new FinnHubService());
}
// if we want to use web service directly   service = new FinnHubService();

let timeFrom = Date.parse("2020-01-16T03:24:00") / 1000;
let timeTo = Date.parse("2020-11-16T03:24:00") / 1000;
// AAPL,IBM,EBAY,GOOG
let companyName = "GOOG";

service.getData(companyName, timeFrom, timeTo).then((data) => {
  // Create the chart
  Highcharts.stockChart("chart-container", {
    chart: {
      type: "spline",
    },
    rangeSelector: {
      selected: 1,
    },

    title: {
      text: data["companyName"] + " Stock Price",
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
});
