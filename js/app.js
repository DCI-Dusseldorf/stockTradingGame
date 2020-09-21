// import { token } from './config.js';
import UI, { elements } from './UI.js';
import Chart from './Chart.js';
import Stock from './Stock.js';
import BoughtStock from './BoughtStock.js';
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
 */
const state = {};

/**
 * Helpers
 */
function toNum(str) {
  return parseFloat(str.replace(/[^0-9-.]/g, ''));
}

/**
 * SEARCH FORM CONTROLLER
 */
async function handleSearch() {
  const query = elements.searchField.value;

  if (query) {
    // const search = new Search(querry);
    state.search = new Search(query);

    // await searchUI.renderLoader();

    await state.search.getResults();

    ui.clearSearchField();
    ui.displaySResults(state.search.results);
  }
}

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSearch();
});

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
    /*
    if (favorite.favStocks.length > 0) {
      // Check whether the current stock is already on the list
      if (favorite.favStocks.some((item) => item === state.symbol)) {
        console.log('already added');
        ui.hideFavBtn();
      } else ui.showFavBtn();
    } else ui.showFavBtn();
    */

    ui.showTrendsBtn();
    // ui.clearSearchField();
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
 * BUY BUTTON (HOMEPAGE) CONTROLLER
 */
elements.buyBtn.addEventListener('click', (e) => {
  e.preventDefault();
  ui.updateTransModal(state.stock);
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
    portfolio.calcCash(state.boughtStock);
    portfolio.calcBalance();

    ui.updateStickyInfo(portfolio);
    ui.updatePortfolioInfo(portfolio);
    ui.addHistory('bought', state.boughtStock);
    ui.clearQuantity();
  } else {
    alert('Insufficient funds. Please deposit more cash');
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
  ui.updateTransModal(state.stock);
  elements.executeOrder.onclick = handleSellStock;
});

function handleSellStock() {
  // Check whether user owns the current stock
  const result = portfolio.hasOwnStock(state.stock.symbol);
  if (result !== undefined) {
    if (result.quantity <= elements.quantity.value) {
      portfolio.removeStock(state.stock.symbol);
      state.boughtStock = new BoughtStock(
        state.stock.symbol,
        result.boughtAt,
        elements.quantity.value
      );
      portfolio.addToPortfolio(state.boughtStock);

      portfolio.sellStock(state.stock.symbol, toNum(elements.totalCost.value));

      portfolio.editPortfolio();
      portfolio.addToLStorage();

      ui.updateStickyInfo(portfolio);
      ui.updatePortfolioInfo(portfolio);
      ui.addHistory('sold', state.boughtStock);
      ui.clearQuantity();
    } else {
      alert(`Insufficient quantity to sell. Please decrease it`);
      // ui.showAlertModal();
    }
  } else {
    alert(`Oops! You don't own this stock`);
    // TODO
    // ui.showAlertModal();
  }
  /*
    state.boughtStock = new BoughtStock(
      state.stock.symbol,
      state.stock.marketPrice,
      elements.quantity.value
    );
    // console.log(state.boughtStock);
    portfolio.addToPortfolio(state.boughtStock);
    portfolio.calcCash(state.boughtStock);
    portfolio.calcBalance();

    ui.updateStickyInfo(portfolio.cash, portfolio.balance);
  */
  // ui.addHistory('sold', state.boughtStock);
  ui.clearQuantity();
  $('#transaction').modal('hide');
}

/**
 * GLOBAL EVENTS CONTROLLER
 */
/*
window.onload = () => {
  // Check favStocks available from localStorage
  // favorite.checkLStorage();
  
  if (favorite.favStocks.length > 1) {
    favorite.favStocks.forEach((symbol) => {
      ui.addToFavList(symbol);
      // state.stock = new Stock(symbol);
      // state.stock.getData();
      // state.stock.calcChange();
      // console.log(state.stock);
      // ui.addToFavorite(state.stock.symbol, state.stock.change);
      // const data = stock.getData(symbol);
      // data.then((data) => console.log(data));
    });
    // if (state.favStocks != false) {
    //   state.favStocks.forEach((symbol) => {
    //     const data = stock.getData(symbol);
    //     data.then((data) => {
    //       const change = stock.calcChange(data);
    //       ui.addToFavorite(symbol, change);
    //     });
    //   });
  } else {
    ui.showEmptyFavorite();
  }

  portfolio.checkLStorage();
  ui.updateStickyInfo(portfolio);
  ui.updatePortfolioInfo(portfolio);
};
*/

portfolio.checkLStorage();
// FIXME
// console.log(portfolio.stocks);
// if (portfolio.stocks.length > 0) {
//   portfolio.stocks.forEach((transaction) => {
//     console.log(transaction.time.toLocaleTime());
//     // ui.addHistory('bought', transaction);
//   });
// }

// console.log(favorite.favStocks);
favorite.checkLStorage();

// console.log(favorite.favStocks);
if (favorite.favStocks.length > 0) {
  favorite.favStocks.forEach((symbol) => {
    ui.addToFavList(symbol);
  });
}

ui.updateStickyInfo(portfolio);
ui.updatePortfolioInfo(portfolio);

/**
 * SIMPLE SIMULATION ENGINE
 */
function simulate() {
  portfolio.checkLStorage();

  console.log('Portfolio value: ' + Number(portfolio.balance).toLocaleString());
  console.log('Simulation begins... getting profit every 10 seconds 🤑🤑🤑');

  portfolio.stocks.forEach((stock) => {
    let luck = Math.random() * (10 - 5) + 5;
    stock.boughtAt += (stock.boughtAt * luck) / 100;
    console.log(luck.toFixed(1) + '% increased');
  });

  let newBalance = 270000; // From cash
  portfolio.stocks.forEach((stock) => {
    newBalance += stock.boughtAt * stock.quantity;
  });
  portfolio.balance = newBalance;
  portfolio.addToLStorage();
  console.log('Now portfolio worths: ' + newBalance.toLocaleString());
}

/** Let's get the fun begins */
// setInterval(simulate, 10000);
