import Stock from './Stock.js';

export class BoughtStock extends Stock {
  constructor(symbol, boughtAt, quantity) {
    super(symbol);
    this.boughtAt = Number(boughtAt);
    this.quantity = Number(quantity);
    this.time = new Date();
    this.cost = boughtAt * quantity;
  }
}

export class SoldStock extends Stock {
  constructor(symbol, soldAt, quantity) {
    super(symbol);
    this.soldAt = Number(soldAt);
    this.quantity = Number(quantity);
    this.time = new Date();
    this.earn = soldAt * quantity;
  }
}
