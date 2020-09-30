// Class to get data from Finnhub
if (!localStorage.myPortfolio) {
  localStorage.setItem("myPortfolio", "[]");
}

if (!localStorage.cash) {
  localStorage.setItem("cash", 1000000);
}

// class to include in the portfolio
export class Portfolio {
  cash = 1000000;
  stocks = [];
  buyValue = Number;
  sellValue = Number;
  stockService;

  constructor(stockWebService) {
    this.stockWebService = stockWebService;
    try {
      if (localStorage.getItem("myPortfolio")) {
        this.stocks = JSON.parse(localStorage.getItem("myPortfolio"));
      } else {
        this.stocks = [];
      }
    } catch (e) {
      this.stocks = [];
    }
    this.render();
  }

  retrieveCash() {
    return Number(localStorage.getItem("cash"));
  }

  setCash(cash) {
    return localStorage.setItem("cash", cash);
  }

  computeQuantity() {
    const quantities = {};
    this.stocks = JSON.parse(localStorage.getItem("myPortfolio"));
    this.stocks.forEach(([symbol, { buyPrice, quantity }], index) => {
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

  async computePortfValue() {
    let portfolioValue = this.retrieveCash();
    const portfQuantity = this.computeQuantity();
    const symbols = Object.keys(portfQuantity);

    const promises = symbols.map(async (symbol) => {
      const currentPrice = await this.getCurrentPrice(symbol);
      portfolioValue += portfQuantity[symbol] * currentPrice;
    });

    await Promise.all(promises);

    localStorage.setItem("PortFolioValue", portfolioValue);
    return portfolioValue;
  }

  async executeBuy(symbol, quantity) {
    const buyPrice = await this.getCurrentPrice(symbol);
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
    await this.computePortfValue();
  }

  async executeSell(symbol, quantity) {
    const sellPrice = await this.getCurrentPrice(symbol);
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
    await this.computePortfValue();
  }

  getCurrentPrice(symbol) {
    return this.stockWebService.getData(symbol).then((data) => {
      return data["marketPrice"];
    });
  }

  render() {
    //const PORTFDISPLAY = document.querySelectorAll("#balance");
    //const CASHDISPLAY = document.querySelectorAll("#cash");
    const PORTFDISPLAY = document.querySelector("#balance");
    const CASHDISPLAY = document.querySelector("#cash");
    //console.log(PORTFOLIO.computePortfValue().toFixed(2));

    // PORTFOLIO.computePortfValue().then((value) => {
    //   PORTFDISPLAY.forEach((element) => {
    //     element.innerHTML = value.toFixed(2);
    //   });
    // });
    this.computePortfValue().then((value) => {
      PORTFDISPLAY.innerHTML = value.toFixed(2);
    });
    // CASHDISPLAY.forEach((element) => {
    //   element.innerHTML = JSON.parse(PORTFOLIO.retrieveCash()).toFixed(2);
    // });
    CASHDISPLAY.innerHTML = JSON.parse(this.retrieveCash()).toFixed(2);
    let myStocks = this.computeQuantity();
    let boughtStocks = "";

    Object.keys(myStocks).forEach(async (key) =>{
      const stockValue = myStocks[key] * (await this.getCurrentPrice(key));

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
}
