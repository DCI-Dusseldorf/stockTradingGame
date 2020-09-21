import Stock from './Stock.js';

export default class BoughtStock extends Stock {
  // Transaction time too?
  constructor(symbol, boughtAt, quantity) {
    super(symbol);
    this.boughtAt = Number(boughtAt);
    this.quantity = Number(quantity);
    this.time = new Date();
    this.cost = boughtAt * quantity;
  }
}
