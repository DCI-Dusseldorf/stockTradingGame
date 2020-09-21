export default class Favorite {
  constructor() {
    this.favStocks = [];
    // this.addToLStorage();
    // this.initLStorage();
  }

  addToFavorite(symbol) {
    this.favStocks.push(symbol);
    console.log(this.favStocks);
  }

  initLStorage() {
    // localStorage.setItem('favStocks', JSon.stringify([]));
  }

  addToLStorage() {
    // if (localStorage.getItem('favStocks') === undefined) {
    localStorage.setItem('favStocks', JSON.stringify(this.favStocks));
    // }
  }

  checkLStorage() {
    if (localStorage.getItem('favStocks') != undefined) {
      this.favStocks = JSON.parse(localStorage.getItem('favStocks'));
    } else if (localStorage.getItem('favStocks') == undefined) {
      this.addToLStorage();
    }
  }

  isDuplicated(symbol) {
    return this.favStocks.find((item) => item === symbol);
  }
}
