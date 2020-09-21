import { elements } from './UI.js';

export default class Portfolio {
  constructor() {
    this.cash = 1000000;
    this.balance = 1000000;
    this.stocks = [];
  }

  buyStock(symbol, price, quantity) {
    this.stocks.push(symbol);
    this.cash = this.cash - price * quantity;
  }

  sellStock(symbol, gain) {
    this.cash = Number(this.cash) + gain;
    // this.removeStock(symbol);
    // this.stocks.push(symbol)
  }

  removeStock(symbol) {
    this.stocks = this.stocks.filter((stock) => stock.symbol != symbol);
  }

  isEnoughCash(price, quantity) {
    const cost = price * quantity;
    return this.cash - cost > 0;
  }

  hasOwnStock(symbol) {
    const ownStocks = JSON.parse(localStorage.getItem('purchased'));
    const result = ownStocks.find((stock) => stock.symbol === symbol);
    return result;
  }

  // done
  addToPortfolio(boughtStock) {
    this.stocks.push(boughtStock);
    console.log('Portfolio has: ', this.stocks);
  }

  editPortfolio(stock) {
    console.log('success');
  }

  // done
  calcCash(stock) {
    this.cash = this.cash - stock.boughtAt * stock.quantity;
    console.log('Cash now is: ' + this.cash);
  }

  // done
  calcBalance() {
    let totalAcc = 0;
    this.stocks.forEach(
      (stock) => (totalAcc += stock.boughtAt * stock.quantity)
    );
    this.balance = this.cash + totalAcc;
    console.log('Balance now is: ' + this.balance);
    this.addToLStorage();
  }

  addToLStorage() {
    localStorage.setItem('cash', this.cash);
    localStorage.setItem('balance', this.balance);
    localStorage.setItem('purchased', JSON.stringify(this.stocks));
  }

  checkLStorage() {
    if (localStorage.getItem('cash') != undefined) {
      this.cash = localStorage.getItem('cash');
      this.balance = localStorage.getItem('balance');
      this.stocks = JSON.parse(localStorage.getItem('purchased'));
    } else if (localStorage.getItem('cash') == undefined) {
      this.addToLStorage();
    }
  }

  getDataFromLS() {
    return JSON.parse(localStorage.getItem('purchased'));
  }
}
