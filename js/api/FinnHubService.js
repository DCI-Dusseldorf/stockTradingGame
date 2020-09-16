class FinnHubService {
  #token = String;
  constructor() {
    this.token = config.TOKEN;
  }
  async getData(company, timeFrom, timeTo) {
    let url =
      "https://finnhub.io/api/v1/stock/candle?symbol=" +
      company +
      "&resolution=D&from=" +
      timeFrom +
      "&to=" +
      timeTo +
      "&token=" +
      this.token;
    const res = await fetch(url);
    const originalData = await res.json();
    let data = this.convertChartData(originalData);

    return { company, data };
  }

  convertChartData(data) {
    const chartData = [];
    for (let i = 0; i < data.t.length; i++) {
      chartData.push([data.t[i] * 1000, data.c[i]]);
    }
    return chartData;
  }
}
