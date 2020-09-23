// import { token } from './config.js';
import UI, { elements } from './UI.js';
import Chart from './Chart.js';
import Stock from './Stock.js';
import { BoughtStock, SoldStock } from './TradedStock.js';
import Favorite from './Favorite.js';
import Portfolio from './Portfolio.js';
import Search from './Search.js';

const ui = new UI();
// const stock = new Stock();
const favorite = new Favorite();
const portfolio = new Portfolio();

/**
 * THE STATE OBJECT
 * Contains these props:
 * - search = new Search(query)
 * - stock = new Stock(symbol)
 * - companyName
 * - chart = new Chart()
 *  boughtStock
 *  soldStock
 */
const state = {};

/**
 * UTILS
 */
function toNum(str) {
  return parseFloat(str.replace(/[^0-9-.]/g, ''));
}

/**
 * RESET BUTTON CONTROLLER
 */
elements.resetBtn.onclick = () => {
  localStorage.clear();
  alert('GAME RESET. PLEASE RELOAD THE PAGE 😎😎😎');
};

/**
 * SEARCH FORM CONTROLLER
 */
elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSearch();
});

async function handleSearch() {
  const query = elements.searchField.value;

  if (query) {
    state.search = new Search(query);
    await state.search.getResults();

    ui.clearSearchField();
    ui.displaySResults(state.search.results);
  }
}
/**
 * SEARCH RESULTS CONTROLLER
 */
function controlSResults() {
  let symbol = window.location.hash.slice(1);
  ui.hideSResults();
  handleStockData(symbol);
}

async function handleStockData(symbol) {
  if (symbol) {
    state.stock = new Stock(symbol);
    state.stock.setCompanyName(state.companyName);
    await state.stock.getData();
    // state.symbol = symbol;
    state.stock.calcChange();

    // console.log(state.stock);
    ui.showFavBtn();
    ui.showTrendsBtn();
    ui.updateStockInfo(state.stock);
    ui.showBuySellBtns();

    state.chart = new Chart();
    state.chart.getData(state.stock);
    state.chart.renderChart();
  }
}

// Get the full company name from the search result
elements.searchResults.addEventListener('click', (e) => {
  let companyInfo = e.target.text;
  let companyName = companyInfo
    .trim()
    .slice(companyInfo.trim().indexOf(' ') + 1);

  state.companyName = companyName;
});

window.addEventListener('hashchange', controlSResults);
window.addEventListener('load', controlSResults);

/**
 * GET TRENDS BUTTON CONTROLLER
 */
async function getTrendsCtrl() {
  await state.stock.getTrends();

  ui.updateTrendsModal(state.stock);
}

elements.trendsBtn.addEventListener('click', (e) => {
  e.preventDefault();
  getTrendsCtrl();
});

/**
 * FAVORITE BUTTON CONTROLLER
 */
elements.favoriteBtn.addEventListener('click', (e) => {
  e.preventDefault();
  updateFavList();
});

function updateFavList() {
  if (favorite.isDuplicated(state.stock.symbol) === undefined) {
    favorite.addToFavorite(state.stock.symbol);
    favorite.addToLStorage();

    // if (favorite.favStocks.length === 1) {
    //   ui.hideEmptyFavoriteMsg();
    // }

    ui.hideFavBtn();
    ui.addToFavList(state.stock.symbol);
  } else alert('Oops! This stock is already in your favorite list 😎');
}

/**
 * FAVORITE STOCKS CONTROLLER
 */
elements.favList.addEventListener('click', (e) => {
  const symbol = e.target.innerText;
  handleStockData(symbol);
});

/**
 * INVESTMENT LIST CONTROLLER
 */
elements.portfolioItems.addEventListener('click', (e) => {
  const symbol = e.target.innerText;
  handleStockData(symbol);
});

/**
 * BUY BUTTON (HOMEPAGE) CONTROLLER
 */
elements.buyBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const totalQuantity = portfolio.getTotalStockQuantity(state.stock.symbol);
  ui.updateTransModal(state.stock, 'buy', totalQuantity);
  elements.executeOrder.onclick = handleBuyStock;
});

function handleBuyStock() {
  // Check whether user has enough cash available
  if (
    portfolio.isEnoughCash(state.stock.marketPrice, elements.quantity.value)
  ) {
    state.boughtStock = new BoughtStock(
      state.stock.symbol,
      state.stock.marketPrice,
      elements.quantity.value
    );
    // console.log(state.boughtStock);
    portfolio.addToPortfolio(state.boughtStock);
    portfolio.addToList(state.boughtStock.symbol);
    portfolio.calcCash(state.boughtStock, 'bought');
    portfolio.calcBalance();

    ui.updatePortfolioInfo(portfolio);
    ui.addHistory('bought', state.boughtStock);
    ui.clearQuantity();
  } else {
    alert('Insufficient funds. Please deposit more cash 💰💰💰');
  }
  $('#transaction').modal('hide');
}

/* Transaction cost calculation */
elements.quantity.addEventListener('keyup', (e) => {
  let quantity = Number(e.target.value);
  ui.updateTotal(quantity);
});

/**
 * SELL BUTTON (HOMEPAGE) CONTROLLER
 */
elements.sellBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const totalQuantity = portfolio.getTotalStockQuantity(state.stock.symbol);
  ui.updateTransModal(state.stock, 'sell', totalQuantity);
  elements.executeOrder.onclick = handleSellStock;
});

function handleSellStock() {
  // Check whether user owns the current stock
  const result = portfolio.hasOwnStock(state.stock.symbol);
  const totalQuantity = portfolio.getTotalStockQuantity(state.stock.symbol);

  if (result !== undefined) {
    if (elements.quantity.value <= totalQuantity) {
      state.soldStock = new SoldStock(
        elements.stockChoice.value,
        state.stock.marketPrice,
        elements.quantity.value
      );

      portfolio.addSoldStock(state.soldStock);
      portfolio.calcCash(state.soldStock, 'sold');
      portfolio.calcBalance();

      ui.updatePortfolioInfo(portfolio);
      ui.addHistory('sold', state.soldStock);
      ui.clearQuantity();
    } else {
      alert(`Insufficient stock quantity to execute the sell order ❌❌❌`);
    }
  } else {
    alert(`Oops! You don't own this stock 🤡🤡🤡`);
  }
  ui.clearQuantity();
  $('#transaction').modal('hide');
}

/**
 * GLOBAL EVENTS CONTROLLER
 */
portfolio.checkLStorage();
if (portfolio.stocks.length > 0) {
  portfolio.calcBalance();

  portfolio.stocks.forEach((transaction) => {
    ui.addHistory('bought', transaction);
  });

  if (portfolio.soldStocks.length > 0) {
    portfolio.soldStocks.forEach((transaction) => {
      ui.addHistory('sold', transaction);
    });
  }

  const list = portfolio.getListFromLS();
  if (list.length > 0) {
    list.forEach((stock) => {
      ui.addPortfolioItem(stock);
    });
  }
} else {
  portfolio.initBalance();
  portfolio.addToLStorage();
}

favorite.checkLStorage();
if (favorite.favStocks.length > 0) {
  favorite.favStocks.forEach((symbol) => {
    ui.addToFavList(symbol);
  });
}

ui.updatePortfolioInfo(portfolio);

/**
 * SIMPLE SIMULATION ENGINE
 */
function simulate() {
  portfolio.checkLStorage();

  console.log('Portfolio value: ' + Number(portfolio.balance).toLocaleString());
  console.log(
    'Simulation begins... getting profit or loss every 10 seconds 🤑🤑🤑'
  );

  portfolio.stocks.forEach((stock) => {
    let luck = Math.random() * (10 - 5) + 5;
    let badLuck = Math.floor(Math.random() * 10) - 9;

    stock.boughtAt += (stock.boughtAt * (luck + badLuck)) / 100;

    console.log(
      stock.symbol +
        ' increased ' +
        luck.toFixed(1) +
        '%' +
        ' but then decreased ' +
        badLuck.toFixed(1) +
        '%'
    );
  });

  let newBalance = Number(portfolio.cash);
  portfolio.stocks.forEach((stock) => {
    newBalance += stock.boughtAt * stock.quantity;
  });
  portfolio.balance = newBalance;
  portfolio.addToLStorage();
  ui.updatePortfolioInfo(portfolio);
  console.log('Now portfolio worths: ' + newBalance.toLocaleString());
}

/** Let's get the fun begins */
// Remember: try to buy some stocks first, then activate the function below
// setInterval(simulate, 10000);
