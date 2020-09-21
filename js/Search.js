const key = 'YPE62ZM66GCMY1KC';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.query}&apikey=${key}`
      );

      // With demo API
      // const response = await fetch(
      //   'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=Micro&apikey=demo'
      // );
      const data = await response.json();
      this.results = data.bestMatches;
    } catch (error) {
      alert(error);
    }
  }
}
