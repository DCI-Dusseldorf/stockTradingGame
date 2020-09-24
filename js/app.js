import FinnHubService from "./api/FinnHubService.js";
import StockProxy from "./proxy/StockProxy.js";
import Chart from "./Chart.js";

let service = new StockProxy(new FinnHubService());
// if we want to use web service directly -> let service = new FinnHubService();

let timeFrom = Date.parse("2020-01-16T03:24:00") / 1000;
let timeTo = Date.parse("2020-11-16T03:24:00") / 1000;
// AAPL,IBM,EBAY,GOOG
let companyName = "GOOG";
let chart = new Chart();
service.getData(companyName, timeFrom, timeTo).then((data) => {
  chart.renderChart(data);
});
