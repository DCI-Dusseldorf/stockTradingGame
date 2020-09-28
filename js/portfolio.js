// Class to get data from Finnhub
class StockData {
  key = "btgepcv48v6thhaqa2lg";
  today = new Date().getTime();

  async getData(symbol) {
    try {
      const url1 = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=1577833200&to=${this.today}&token=${this.key}`;
      const response = await fetch(url1);
      const data = await response.json();
      const chartData = [];
      for (let i = 0; i < data.t.length; i++) {
        chartData.push([data.t[i] * 1000, data.c[i]]);
      }
      return chartData;
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrentPrice(symbol) {
    return await this.getData(symbol).then((data) => data.pop()[1]);
  }
}

//Class to Buy or Sell stocks
class BuyOrSell {
  buyValue = Number;
  sellValue = Number;

  async executeBuy(symbol, quantity) {
    const buyPrice = await stock.getCurrentPrice(symbol);
    this.buyValue = buyPrice * quantity;
    let cash = PORTFOLIO.retrieveCash();
    if (this.buyValue < cash) {
      alert("Buy order executed successfully");
      PORTFOLIO.addToPortfolio(symbol, buyPrice, quantity);
      cash = cash - this.buyValue;
      PORTFOLIO.setCash(cash);
    } else {
      alert("Insufficient balance to execute Buy order");
    }
    PORTFOLIO.computePortfValue();
  }

  async executeSell(symbol, quantity) {
    const sellPrice = await stock.getCurrentPrice(symbol);
    this.sellValue = sellPrice * quantity;
    let cash = JSON.parse(PORTFOLIO.retrieveCash());
    const portfQuantity = PORTFOLIO.computeQuantity();
    if (quantity <= portfQuantity[symbol]) {
      alert("Sell order executed successfully");
      PORTFOLIO.addToPortfolio(symbol, sellPrice, quantity * -1);
      cash = cash + this.sellValue;
      PORTFOLIO.setCash(cash);
    } else {
      alert("Insufficient quantity to execute Sell order");
    }
    PORTFOLIO.computePortfValue();
  }
}

// class to include in the portfolio
class Portfolio {
  cash = 1000000;
  stocks = [];

  constructor() {
    try {
      if (localStorage.getItem("myPortfolio")) {
        this.stocks = JSON.parse(localStorage.getItem("myPortfolio"));
      } else {
        this.stocks = [];
      }
    } catch (e) {
      this.stocks = [];
    }
  }

  retrieveCash() {
    return localStorage.getItem("cash");
  }

  setCash(cash) {
    return localStorage.setItem("cash", cash);
  }

  computeQuantity() {
    const quantities = {};
    let tempArray = [];
    this.stocks = JSON.parse(localStorage.getItem("myPortfolio"));
    this.stocks.forEach(([symbol, { buyPrice, quantity }], index) => {
      tempArray = this.stocks[index];
      if (quantities[symbol]) {
        quantities[symbol] += parseInt(quantity);
      } else {
        quantities[symbol] = parseInt(quantity);
      }
    });
    return quantities;
  }

  addToPortfolio(symbol, buyPrice, quantity) {
    //write all the 3 values in local storage
    this.stocks.push([symbol, { buyPrice, quantity }]);
    localStorage.setItem("myPortfolio", JSON.stringify(this.stocks));
  }

  computePortfValue() {
    let portfolioValue = 0;
    const portfQuantity = this.computeQuantity();

    Object.keys(portfQuantity).forEach(async (symbol) => {
      const currentPrice = await stock.getCurrentPrice(symbol);
      portfolioValue += portfQuantity[symbol] * currentPrice;
      localStorage.setItem("PortFolioValue", portfolioValue);
    });
    return JSON.parse(localStorage.getItem("PortFolioValue"));
  }
}

// Main routine;
let PORTFOLIO = new Portfolio();
let stock = new StockData();

const symbol = document.getElementById("stockChoice");
const quantity = document.getElementById("quantity");
const btnExecute = document.getElementById("executeOrder");

//Buy order execution
const buyBtn = document.getElementById("buyBtn");
buyBtn.addEventListener("click", (e) => {
  symbol.value = location.hash.slice(1);
  btnExecute.addEventListener("click", (e) => {
    e.preventDefault();
    const exec = new BuyOrSell();
    exec.executeBuy(symbol.value, quantity.value);
    display();
  });
});

//Sell order execution
const sellBtn = document.getElementById("sellBtn");
sellBtn.addEventListener("click", (e) => {
  symbol.value = location.hash.slice(1);
  btnExecute.addEventListener("click", (e) => {
    e.preventDefault();
    const exec = new BuyOrSell();
    exec.executeSell(symbol.value, quantity.value);
    display();
  });
});

const PORTFDISPLAY = document.querySelectorAll("#balance");
const CASHDISPLAY = document.querySelectorAll("#cash");

function display() {
  console.log(PORTFOLIO.computePortfValue().toFixed(2));

  PORTFDISPLAY.forEach((element) => {
    element.innerHTML = PORTFOLIO.computePortfValue().toFixed(2);
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
