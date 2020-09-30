import FinnHubService from "./api/FinnHubService.js";
import StockProxy from "./proxy/StockProxy.js";
import AlphaVantageService from "./api/AlphaVantageService.js";
import SearchProxy from "./proxy/SearchProxy.js";
import Chart from "./Chart.js";
import Search from "./Search.js";
import { Portfolio } from "./portfolio.js";
import TransactionHistory from "./TransactionHistory.js";

let searchWebService = new SearchProxy(new AlphaVantageService());
let stockWebService = new StockProxy(new FinnHubService());
let search = new Search(searchWebService);
let PORTFOLIO = new Portfolio(stockWebService);
let transactionHistory = new TransactionHistory();

const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  search.handleSearch(document.getElementById("searchField").value);
});

function displayChart() {
  if (location.hash.length < 2) return;
  let companySymbol = location.hash.slice(1);
  stockWebService.getData(companySymbol).then((data) => {
    chart.renderChart(data);

    infoHeaders[0].innerText = companySymbol;
    infoHeaders[1].innerText = "$" + data.marketPrice;
    infoHeaders[2].innerText = "";
  });
  $("#buyBtn").removeClass("d-none");
  $("#sellBtn").removeClass("d-none");
  $("#trendsBtn").removeClass("d-none");
  $("#favoriteBtn").removeClass("d-none");
}

let chart = new Chart();
const infoHeaders = document.querySelectorAll("#stockInfo h2");
window.addEventListener("hashchange", displayChart, false);

if (window.location.hash.length > 0) displayChart();

// Portfolio buy, sell and display-----------------

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
  btnExecute.addEventListener("click", async (e) => {
    e.preventDefault();
    //const exec = new BuyOrSell();
    await PORTFOLIO.executeBuy(symbol.value, quantity.value);
    PORTFOLIO.render();
    transactionHistory.render();
    $("#transaction").modal("hide");
  });
});
//---ESTIMATED PRICE DISPLAY

quantity.addEventListener("keyup", (e) => {
  let amount = Number(e.target.value);
  let cost = amount * Number(infoHeaders[1].innerText.substring(1));
  document.querySelector("#totalCost").value = "$" + cost;
});

//Sell order execution
const sellBtn = document.getElementById("sellBtn");
sellBtn.addEventListener("click", (e) => {
  transactionType.innerText = "Review Selling Order";
  const marketPrice = infoHeaders[1].innerText;
  document.querySelector("#marketPrice").value = marketPrice;
  symbol.value = location.hash.slice(1);
  btnExecute.addEventListener("click", async (e) => {
    e.preventDefault();
    //const exec = new BuyOrSell();
    await PORTFOLIO.executeSell(symbol.value, quantity.value);
    PORTFOLIO.render();
    transactionHistory.render();
    $("#transaction").modal("hide");
  });
});


