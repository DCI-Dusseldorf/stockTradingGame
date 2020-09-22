// THE DEFAULT CHART IS JUST FOR DEMO PURPOSED
// START EDIT YOUR JS FILE FROM HERE

Highcharts.getJSON(
  "https://demo-live-data.highcharts.com/aapl-c.json",
  function (data) {
    // Create the chart
    Highcharts.stockChart("chart-container", {
      chart: {
        type: "spline",
      },
      rangeSelector: {
        selected: 1,
      },

      title: {
        text: "AAPL Stock Price",
      },

      series: [
        {
          name: "AAPL",
          data: data,
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    });
  }
);

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
class BuyOrSell extends StockData {
  buyValue = Number;
  sellValue = Number;

  async executeBuy(symbol, quantity) {
    const buyPrice = await super.getCurrentPrice(symbol);
    this.buyValue = buyPrice * quantity;
    let cash = PORTFOLIO.retrieveCash();
    if (this.buyValue < cash) {
      console.log("Buy order executed successfully");
      PORTFOLIO.addToPortfolio(symbol, buyPrice, quantity);
      cash = cash - this.buyValue;
      PORTFOLIO.setCash(cash);
    } else {
      console.log("Insufficient balance to execute Buy order");
    }
    PORTFOLIO.computePortfValue();
  }

  async executeSell(symbol, quantity) {
    const sellPrice = await super.getCurrentPrice(symbol);
    this.sellValue = sellPrice * quantity;
    let cash = JSON.parse(PORTFOLIO.retrieveCash());
    const portfQuantity = PORTFOLIO.computeQuantity();
    if (quantity <= portfQuantity[symbol]) {
      console.log("Sell order executed successfully");
      PORTFOLIO.addToPortfolio(symbol, sellPrice, quantity * -1);
      cash = cash + this.sellValue;
      PORTFOLIO.setCash(cash);
    } else {
      console.log("Insufficient quantity to execute Sell order");
    }
    PORTFOLIO.computePortfValue();
  }
}

// class to include in the portfolio
class Portfolio extends StockData {
  cash = 1000000;
  stocks = [];

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
      const currentPrice = await super.getCurrentPrice(symbol);
      portfolioValue += portfQuantity[symbol] * currentPrice;
      localStorage.setItem("PortFolio Value", portfolioValue);
    });
    return JSON.parse(localStorage.getItem("PortFolioValue")).toFixed(2);
  }
}

// Main routine;
let PORTFOLIO = new Portfolio();

// const btnBuy = document.getElementById("buy");
// const btnSell = document.getElementById("sell");
// const btnrefreshPortfolio = document.getElementById("refreshPortfolio");

// btnBuy.addEventListener("click", (e) => {
//   e.preventDefault();
//   const exec = new BuyOrSell();
//   let symbol = prompt("please enter the symbol", "AAPL");
//   let quantity = prompt("please enter the quantity", 1);

//   exec.executeBuy(symbol, quantity);
// });

// btnSell.addEventListener("click", (e) => {
//   e.preventDefault();
//   const exec = new BuyOrSell();
//   let symbol = prompt("please enter the symbol", "AAPL");
//   let quantity = prompt("please enter the quantity", 1);
//   exec.executeSell(symbol, quantity);
// });

// const PORTFVALUE = document.querySelector(".portfValue");
// const PORTFDISPLAY = document.getElementById("portfDisplay");
// PORTFVALUE.addEventListener("click", (e) => {
//   e.preventDefault();
//   //PORTFDISPLAY.innerText = PORTFOLIO.computePortfValue();
// });
//const PORTFVALUE = document.querySelector(".portfValue");
const PORTFDISPLAY = document.querySelector(".portfDisplay");
console.log(PORTFDISPLAY);

function display() {
  PORTFDISPLAY = PORTFOLIO.computePortfValue();
}
