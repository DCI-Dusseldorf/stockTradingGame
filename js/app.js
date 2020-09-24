import FinnHubService from "./api/FinnHubService.js";
import StockProxy from "./proxy/StockProxy.js";
import Chart from "./Chart.js";
import Search from "./Search.js";

let service = new StockProxy(new FinnHubService());
let chart = new Chart();

window.addEventListener(
  "hashchange",
  function () {
    const timeFrom = Date.parse("2020-01-01T00:00:00") / 1000;
    const timeTo = new Date().getTime();
    let companyName = location.hash.slice(1);
    service.getData(companyName, timeFrom, timeTo).then((data) => {
      chart.renderChart(data);
    });
    $("#buyBtn").removeClass("d-none");
    $("#sellBtn").removeClass("d-none");
    $("#trendsBtn").removeClass("d-none");
    $("#favoriteBtn").removeClass("d-none");
  },
  false
);
