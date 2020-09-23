import { elements } from './UI.js';

export default class Portfolio {
  constructor() {
    this.cash = 1000000;
    // this.balance = 1000000;
    this.stocks = [];
    this.soldStocks = [];
    this.investmentList = [];
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

  getTotalStockQuantity(symbol) {
    const ownStocks = JSON.parse(localStorage.getItem('purchased'));
    const matches = ownStocks.filter((stock) => stock.symbol === symbol);
    let quantityCount = 0;
    matches.forEach((stock) => (quantityCount += stock.quantity));

    const soldStocks = JSON.parse(localStorage.getItem('sold'));
    const matches2 = soldStocks.filter((stock) => stock.symbol === symbol);
    matches2.forEach((stock) => (quantityCount -= stock.quantity));

    return quantityCount;
  }

  // done
  addToPortfolio(boughtStock) {
    this.stocks.push(boughtStock);
  }

  addToList(symbol) {
    const isDuplicated = this.hasOwnStock(symbol);
    console.log(isDuplicated);
    if (isDuplicated === undefined) {
      this.investmentList.push(symbol);
    }
    console.log(this.investmentList);
  }

  editPortfolio(stock) {
    console.log('success');
  }

  // done
  calcCash(stock, type) {
    if (type === 'bought') {
      this.cash = this.cash - stock.boughtAt * stock.quantity;
    } else {
      this.cash = this.cash + stock.soldAt * stock.quantity;
    }
    console.log('Cash now is: ' + this.cash);
  }

  initBalance() {
    this.balance = this.cash;
  }

  // done
  calcBalance() {
    let totalAcc = 0;
    let totalSold = 0;

    this.stocks.forEach(
      (stock) => (totalAcc += stock.boughtAt * stock.quantity)
    );
    this.soldStocks.forEach(
      (stock) => (totalSold += stock.soldAt * stock.quantity)
    );

    this.balance = this.cash + totalAcc - totalSold;
    // console.log('Balance now is: ' + this.balance);
    this.addToLStorage();
  }

  addToLStorage() {
    localStorage.setItem('cash', this.cash);
    localStorage.setItem('balance', this.balance);
    localStorage.setItem('purchased', JSON.stringify(this.stocks));
    localStorage.setItem('sold', JSON.stringify(this.soldStocks));
    localStorage.setItem('investmentList', JSON.stringify(this.investmentList));
  }

  addSoldStock(stock) {
    this.soldStocks.push(stock);
    localStorage.setItem('sold', JSON.stringify(this.soldStocks));
  }

  checkLStorage() {
    if (localStorage.getItem('cash') != undefined) {
      this.cash = Number(localStorage.getItem('cash'));
      this.balance = Number(localStorage.getItem('balance'));
      this.stocks = JSON.parse(localStorage.getItem('purchased'));
      this.soldStocks = JSON.parse(localStorage.getItem('sold'));
      this.investmentList = JSON.parse(localStorage.getItem('investmentList'));
    } else if (localStorage.getItem('cash') == undefined) {
      this.addToLStorage();
    }
  }

  getDataFromLS() {
    return JSON.parse(localStorage.getItem('purchased'));
  }

  getListFromLS() {
    return JSON.parse(localStorage.getItem('investmentList'));
  }
}
