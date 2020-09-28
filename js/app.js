import FinnHubService from "./api/FinnHubService.js";
import StockProxy from "./proxy/StockProxy.js";
import Chart from "./Chart.js";
import Search from "./Search.js";

let search = new Search();
const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  search.handleSearch(document.getElementById("searchField").value);
});

let service = new StockProxy(new FinnHubService());
let chart = new Chart();

window.addEventListener(
  "hashchange",
  function () {
    const timeFrom = Date.parse("2020-01-01T00:00:00") / 1000;
    const timeTo = new Date().getTime();
    let companySymbol = location.hash.slice(1);
    service.getData(companySymbol, timeFrom, timeTo).then((data) => {
      chart.renderChart(data);
      const infoHeaders = document.querySelectorAll("#stockInfo h2");
      infoHeaders[0].innerText = companySymbol;
      infoHeaders[1].innerText = "$" + data.marketPrice;
      infoHeaders[2].innerText = "";
    });
    $("#buyBtn").removeClass("d-none");
    $("#sellBtn").removeClass("d-none");
    $("#trendsBtn").removeClass("d-none");
    $("#favoriteBtn").removeClass("d-none");
  },
  false
);
