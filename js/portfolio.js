// Class to get data from Finnhub
export class StockData {
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
let stock = new StockData();
//Class to Buy or Sell stocks

// class to include in the portfolio
export class Portfolio {
  cash = 1000000;
  stocks = [];
  buyValue = Number;
  sellValue = Number;

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
  async executeBuy(symbol, quantity) {
    const buyPrice = await stock.getCurrentPrice(symbol);
    this.buyValue = buyPrice * quantity;
    let cash = this.retrieveCash();
    if (this.buyValue < cash) {
      alert("Buy order executed successfully");
      this.addToPortfolio(symbol, buyPrice, quantity);
      cash = cash - this.buyValue;
      this.setCash(cash);
    } else {
      alert("Insufficient balance to execute Buy order");
    }
    this.computePortfValue();
  }

  async executeSell(symbol, quantity) {
    const sellPrice = await stock.getCurrentPrice(symbol);
    this.sellValue = sellPrice * quantity;
    let cash = JSON.parse(this.retrieveCash());
    const portfQuantity = this.computeQuantity();
    if (quantity <= portfQuantity[symbol]) {
      alert("Sell order executed successfully");
      this.addToPortfolio(symbol, sellPrice, quantity * -1);
      cash = cash + this.sellValue;
      this.setCash(cash);
    } else {
      alert("Insufficient quantity to execute Sell order");
    }
    this.computePortfValue();
  }
}
