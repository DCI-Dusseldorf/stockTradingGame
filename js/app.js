import FinnHubService from "./api/FinnHubService.js";
import StockProxy from "./proxy/StockProxy.js";
import AlphaVantageService from "./api/AlphaVantageService.js";
import SearchProxy from "./proxy/SearchProxy.js";
import Chart from "./Chart.js";
import Search from "./Search.js";
import { Portfolio } from "./Portfolio.js";

let searchWebService = new SearchProxy(new AlphaVantageService());
let stockWebService = new StockProxy(new FinnHubService());
let search = new Search(searchWebService);
let portfolio = new Portfolio(stockWebService);

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

  let myStocks = portfolio.computeQuantity();
  if (myStocks.hasOwnProperty(symbol.value)) {
    document.getElementById("label").innerText = `${symbol.value}-${
      myStocks[symbol.value]
    } Shares Owned `;
  } else {
    document.getElementById(
      "label"
    ).innerText = `${symbol.value}- 0 Share Owned `;
  }
  btnExecute.onclick = async (e) => {
    e.preventDefault();
    await portfolio.executeBuy(symbol.value, quantity.value);
    display();
    transactionHistory();
    $("#transaction").modal("hide");
  };
});
//---ESTIMATED PRICE DISPLAY

quantity.addEventListener("keyup", (e) => {
  let amount = Number(e.target.value);
  let cost = amount * Number(infoHeaders[1].innerText.substring(1));
  document.querySelector("#totalCost").value = "$" + cost.toFixed(2);
});

//Sell order execution
const sellBtn = document.getElementById("sellBtn");
sellBtn.addEventListener("click", (e) => {
  transactionType.innerText = "Review Selling Order";
  const marketPrice = infoHeaders[1].innerText;
  document.querySelector("#marketPrice").value = marketPrice;
  symbol.value = location.hash.slice(1);
  let myStocks = portfolio.computeQuantity();
  if (myStocks.hasOwnProperty(symbol.value)) {
    document.getElementById("label").innerText = `${symbol.value}-${
      myStocks[symbol.value]
    } Shares Owned `;
  } else {
    document.getElementById(
      "label"
    ).innerText = `${symbol.value}- 0 Share Owned `;
  }
  btnExecute.onclick = async (e) => {
    e.preventDefault();
    if (Number(quantity.value) > 0) {
      await portfolio.executeSell(symbol.value, quantity.value);
      display();
      transactionHistory();
      $("#transaction").modal("hide");
    } else {
      alert("Please enter a positive quantity");
    }
  };
});

const PORTFDISPLAY = document.querySelector("#balance");
const CASHDISPLAY = document.querySelector("#cash");

function display() {
  portfolio.computePortfValue().then((value) => {
    PORTFDISPLAY.innerHTML = value.toFixed(2);
  });

  CASHDISPLAY.innerHTML = JSON.parse(portfolio.retrieveCash()).toFixed(2);

  let boughtStocks = "";

  // remove all items first
  $("#portfolioItems").html("");
  let myStocks = portfolio.computeQuantity();

  Object.keys(myStocks).forEach(async function (key) {
    if (myStocks[key] !== 0) {
      const stockValue = myStocks[key] * (await portfolio.getCurrentPrice(key));

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
      console.log(boughtStocks);
      $("#portfolioItems").html(boughtStocks);
    }
  });
}

display();

function transactionHistory() {
  const markup = `<table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Symbol</th>
          <th scope="col">Bought/Sold</th>
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
      trxType = "Sold";
    } else {
      trxType = "Bought";
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
