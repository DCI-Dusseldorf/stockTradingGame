const searchForm = document.getElementById("searchForm");
const searchField = document.getElementById("searchField");
const results = document.getElementById("chart-container");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("nisha");
  handleSearch();
});

async function handleSearch() {
  let query = searchField.value;
  if (query) {
    const search = new Search(query);
    await search.getSearchResults();
    renderSearch(search.found);
  }
}

class Search {
  constructor(query) {
    this.query = query;
  }
  async getSearchResults() {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.query}&apikey=KS83EIH10ASG1URC`
    );

    const data = await res.json();
    this.results = data;
    this.found = data.bestMatches;
    console.log(data);
  }
}

function renderSearch(bestMatches) {
  results.innerHTML = "";
  bestMatches.forEach((stock) => {
    const markup = `<p><b>${stock["1. symbol"]}</b> ${stock["2. name"]}</p>`;
    results.insertAdjacentHTML("beforeend", markup);
  });
}
