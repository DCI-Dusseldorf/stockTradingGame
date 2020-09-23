class FinnHubService {
  #token = String;
  constructor() {
    this.token = config.TOKEN;
  }
  async getData(companyName, timeFrom, timeTo) {
    let url =
      "https://finnhub.io/api/v1/stock/candle?symbol=" +
      companyName +
      "&resolution=D&from=" +
      timeFrom +
      "&to=" +
      timeTo +
      "&token=" +
      this.token;
    const res = await fetch(url);
    const originalData = await res.json();
    let dataSet = this.convertChartData(originalData);
    return { companyName, dataSet };
  }

  convertChartData(data) {
    const chartData = [];
    for (let i = 0; i < data.t.length; i++) {
      chartData.push([data.t[i] * 1000, parseFloat(data.c[i].toFixed(2))]);
    }
    return chartData;
  }
}
