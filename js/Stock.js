const token = 'btfnglf48v6rl6gbnmeg';

export default class Stock {
  constructor(symbol) {
    this.symbol = symbol;
    // this.stocks = [];
  }

  async getData() {
    try {
      const timeFrom = Date.parse('2020-01-01T00:00:00') / 1000;
      const today = new Date().getTime();
      let url = `https://finnhub.io/api/v1/stock/candle?symbol=${this.symbol}&resolution=D&from=${timeFrom}&to=${today}&token=${token}`;
      const res = await fetch(url);
      const data = await res.json();
      this.data = data;
      this.marketPrice = data.c[data.c.length - 1].toFixed(2);
    } catch (error) {
      console.log(error);
    }
  }

  async getTrends() {
    let url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${this.symbol}&token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    this.trends = data;
    this.processTrendsData();
  }

  setCompanyName(name) {
    this.companyName = name;
  }

  calcChange() {
    try {
      const change =
        (this.data.c[this.data.c.length - 1] -
          this.data.c[this.data.c.length - 2]) /
        this.data.c[this.data.c.length - 2];
      this.change = change;
    } catch (error) {
      alert(`SORRY...\n\n\nTHIS STOCK DATA IS NOT AVAILABLE`);
    }
  }

  processTrendsData() {
    const total =
      this.trends[0].strongBuy +
      this.trends[0].buy +
      this.trends[0].hold +
      this.trends[0].sell +
      this.trends[0].strongSell;
    this.strongBuy = ((this.trends[0].strongBuy / total) * 100).toFixed(2);
    this.buy = ((this.trends[0].buy / total) * 100).toFixed(2);
    this.hold = ((this.trends[0].hold / total) * 100).toFixed(2);
    this.sell = ((this.trends[0].sell / total) * 100).toFixed(2);
    this.strongSell = ((this.trends[0].strongSell / total) * 100).toFixed(2);
  }
}
