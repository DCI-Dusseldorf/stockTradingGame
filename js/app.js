import FinnHubService from "./api/FinnHubService.js";
import StockProxy from "./proxy/StockProxy.js";
import AlphaVantageService from "./api/AlphaVantageService.js";
import SearchProxy from "./proxy/SearchProxy.js";
import Chart from "./Chart.js";
import Search from "./Search.js";
import { Portfolio } from "./portfolio.js";

let searchWebService = new SearchProxy(new AlphaVantageService());
let stockWebService = new StockProxy(new FinnHubService());
let search = new Search(searchWebService);
let PORTFOLIO = new Portfolio(stockWebService);

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
  btnExecute.addEventListener("click", (e) => {
    e.preventDefault();
    //const exec = new BuyOrSell();
    PORTFOLIO.executeBuy(symbol.value, quantity.value);
    display();
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
  btnExecute.addEventListener("click", (e) => {
    e.preventDefault();
    //const exec = new BuyOrSell();
    PORTFOLIO.executeSell(symbol.value, quantity.value);
    display();
    $("#transaction").modal("hide");
  });
});

//const PORTFDISPLAY = document.querySelectorAll("#balance");
//const CASHDISPLAY = document.querySelectorAll("#cash");
const PORTFDISPLAY = document.querySelector("#balance");
const CASHDISPLAY = document.querySelector("#cash");

function display() {
  //console.log(PORTFOLIO.computePortfValue().toFixed(2));

  // PORTFOLIO.computePortfValue().then((value) => {
  //   PORTFDISPLAY.forEach((element) => {
  //     element.innerHTML = value.toFixed(2);
  //   });
  // });
  PORTFOLIO.computePortfValue().then((value) => {
    PORTFDISPLAY.innerHTML = value.toFixed(2);
  });
  // CASHDISPLAY.forEach((element) => {
  //   element.innerHTML = JSON.parse(PORTFOLIO.retrieveCash()).toFixed(2);
  // });
  CASHDISPLAY.innerHTML = JSON.parse(PORTFOLIO.retrieveCash()).toFixed(2);
  let myStocks = PORTFOLIO.computeQuantity();
  let boughtStocks = "";

  Object.keys(myStocks).forEach(async function (key) {
    const stockValue = myStocks[key] * (await PORTFOLIO.getCurrentPrice(key));

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

function transactionHistory() {
  const markup = `<table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Symbol</th>
          <th scope="col">Buy/Sell</th>
          <th scope="col">Trx-Price</th>
          <th scope="col">Quantity</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>`;
  $("#transactionTable").html(markup);

  const transaction = JSON.parse(localStorage.getItem("myPortfolio"));
  let trnMarkup = "";
  let trxType = "";
  transaction.forEach(([symbol, { buyPrice, quantity }]) => {
    if (quantity < 0) {
      trxType = "Sell";
    } else {
      trxType = "Buy";
    }
    trnMarkup += `<tr>
      <th scope="row">${symbol}</th>
      <td>${trxType}</td>
      <td>${Number(buyPrice).toFixed(2)}</td>
      <td>${Math.abs(quantity)}</td>
      <td>${Math.abs(buyPrice * quantity).toFixed(2)}</td>
    </tr>`;

    $("#transactionTable tbody").html(trnMarkup);
  });
}
transactionHistory();
