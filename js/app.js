import FinnHubService from "./api/FinnHubService.js";
import StockProxy from "./proxy/StockProxy.js";
import AlphaVantageService from "./api/AlphaVantageService.js";
import SearchProxy from "./proxy/SearchProxy.js";
import Chart from "./Chart.js";
import Search from "./Search.js";
import { StockData, Portfolio } from "./portfolio.js";

let searchWebService = new SearchProxy(new AlphaVantageService());
let search = new Search(searchWebService);
let PORTFOLIO = new Portfolio();
let stock = new StockData();

const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  search.handleSearch(document.getElementById("searchField").value);
});

let service = new StockProxy(new FinnHubService());
let chart = new Chart();
const infoHeaders = document.querySelectorAll("#stockInfo h2");
window.addEventListener(
  "hashchange",
  function () {
    const timeFrom = Date.parse("2020-01-01T00:00:00") / 1000;
    const timeTo = new Date().getTime();
    let companySymbol = location.hash.slice(1);
    service.getData(companySymbol, timeFrom, timeTo).then((data) => {
      chart.renderChart(data);

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

// Portfolio buy, sell and display

const symbol = document.getElementById("stockChoice");
const quantity = document.getElementById("quantity");
const btnExecute = document.getElementById("executeOrder");

//Buy order execution
const buyBtn = document.getElementById("buyBtn");
buyBtn.addEventListener("click", (e) => {
  transactionType.innerText = "Review Buying Order";
  const marketPrice = infoHeaders[1].innerText;
  document.querySelector("#marketPrice").value = marketPrice;
  symbol.value = location.hash.slice(1);
  btnExecute.addEventListener("click", (e) => {
    e.preventDefault();
    //const exec = new BuyOrSell();
    PORTFOLIO.executeBuy(symbol.value, quantity.value);
    display();
  });
});

//Sell order execution
const sellBtn = document.getElementById("sellBtn");
sellBtn.addEventListener("click", (e) => {
  transactionType.innerText = "Review Selling Order";
  const marketPrice = infoHeaders[1].innerText;
  document.querySelector("#marketPrice").value = marketPrice;
  symbol.value = location.hash.slice(1);
  btnExecute.addEventListener("click", (e) => {
    e.preventDefault();
    //const exec = new BuyOrSell();
    PORTFOLIO.executeSell(symbol.value, quantity.value);
    display();
  });
});

const PORTFDISPLAY = document.querySelectorAll("#balance");
const CASHDISPLAY = document.querySelectorAll("#cash");

function display() {
  //console.log(PORTFOLIO.computePortfValue().toFixed(2));

  PORTFOLIO.computePortfValue().then((value) => {
    PORTFDISPLAY.forEach((element) => {
      element.innerHTML = value.toFixed(2);
    });
  });
  CASHDISPLAY.forEach((element) => {
    element.innerHTML = JSON.parse(PORTFOLIO.retrieveCash()).toFixed(2);
  });
  let myStocks = PORTFOLIO.computeQuantity();
  let boughtStocks = "";

  Object.keys(myStocks).forEach(async function (key) {
    const stockValue = myStocks[key] * (await stock.getCurrentPrice(key));
    //console.log(key, myStocks[key]);

    boughtStocks += `<div
  class="a bg-white bg-hover-gradient-blue shadow roundy px-4 py-3 d-flex align-items-center justify-content-between mb-4"
  >
  <div class="2 flex-grow-1 d-flex align-items-center">
    <div class="3 text">
      <h6 class="4 mb-0">${key}</h6>
      <span class="5 text-gray">${myStocks[key]}Shares</span>
    </div>
  </div>
  <div class="6 text-green font-weight-bold">
      ${stockValue.toFixed(2)}
  </div>
  </div>`;
    $("#portfolioItems").html(boughtStocks);
  });
}

display();
