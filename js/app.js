import FinnHubService from "./api/FinnHubService.js";
import StockProxy from "./proxy/StockProxy.js";
import Chart from "./Chart.js";
import Search from "./Search.js";

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

window.addEventListener(
  "hashchange",
  function () {
    console.log(location.hash.slice(1));

    let timeFrom = Date.parse("2020-01-16T03:24:00") / 1000;
    let timeTo = Date.parse("2020-11-16T03:24:00") / 1000;
    // AAPL,IBM,EBAY,GOOG
    let companyName = location.hash.slice(1);
    let chart = new Chart();
    service.getData(companyName, timeFrom, timeTo).then((data) => {
      chart.renderChart(data);
    });
    $("#buyBtn").removeClass("d-none");
    $("#sellBtn").removeClass("d-none");
  },
  false
);
