export const elements = {
  searchForm: document.getElementById('searchForm'),
  searchField: document.getElementById('searchField'),
  stockInfo: document.getElementById('stockInfo'),
  stockInfoHeaders: document.querySelectorAll('#stockInfo h2'),
  favoriteBtn: document.getElementById('favoriteBtn'),
  trendsBtn: document.getElementById('trendsBtn'),
  favList: document.getElementById('favList'),
  portfolioInfo: document.getElementById('portfolioInfo'),
  portfolioItems: document.getElementById('portfolioItems'),
  trendsModal: document.querySelector('#trendsModal .modal-body'),
  transactionModal: document.getElementById('transactionModal'),
  transactionType: document.getElementById('transactionType'),
  trendsBtn: document.getElementById('trendsBtn'),
  stockChoice: document.getElementById('stockChoice'),
  marketPrice: document.getElementById('marketPrice'),
  quantity: document.getElementById('quantity'),
  totalCost: document.getElementById('totalCost'),
  searchResults: document.getElementById('searchResults'),
  chartContainer: document.getElementById('chart-container'),
  stickyCash: document.getElementById('stickyCash'),
  stickyBalance: document.getElementById('stickyBalance'),
  executeOrder: document.getElementById('executeOrder'),
  buyBtn: document.getElementById('buyBtn'),
  sellBtn: document.getElementById('sellBtn'),
  resetBtn: document.getElementById('resetBtn'),
  history: document.getElementById('transactionHistory'),
  historyCredit: document.getElementById('transactionHistoryCredit'),
  balance: document.getElementById('balance'),
  cash: document.getElementById('cash'),
};

export default class UI {
  clearSearchField() {
    elements.searchField.value = '';
  }

  updateStockInfo(stock) {
    let markup = '';

    elements.stockInfoHeaders[0].innerHTML = stock.symbol;
    elements.stockInfoHeaders[1].innerHTML =
      '$' + stock.marketPrice.toLocaleString();

    if (stock.change >= 0) {
      markup = `
        <h2 class="h6 text-uppercase text-green">
          <i class="fas fa-caret-up mr-1"></i>${stock.change.toFixed(2)}%
        </h2>`;
    } else {
      markup = `
        <h2 class="h6 text-uppercase text-red">
          <i class="fas fa-caret-down mr-1"></i>${Math.abs(
            stock.change
          ).toFixed(2)}%
        </h2>`;
    }
    elements.stockInfoHeaders[2].innerHTML = markup;
  }

  updateFavBtn(state) {
    if (state) {
      elements.favoriteBtn.innerText = 'UNLIKE';
      elements.favoriteBtn.classList.add('btn-danger');
      // elements.favoriteBtn.classList.add('disabled');
    } else {
      elements.favoriteBtn.classList.remove('disabled');
    }
  }

  showTrendsBtn() {
    elements.trendsBtn.classList.remove('d-none');
  }

  showFavBtn() {
    elements.favoriteBtn.classList.remove('d-none');
  }

  showBuySellBtns() {
    elements.buyBtn.classList.remove('d-none');
    elements.sellBtn.classList.remove('d-none');
  }

  updateTrendsModal(stock) {
    const markup = `
    <div class="bg-success p-3">
      ${stock.strongBuy}% Strong Buy
    </div>
    <div class="bg-success p-3">
      ${stock.buy}% Buy
    </div>
    <div class="bg-warning p-3">
      ${stock.hold}% Hold
    </div>
    <div class="bg-danger p-3">
      ${stock.sell}% Sell
    </div>
    <div class="bg-danger p-3">
      ${stock.strongSell}% Strong Sell
    </div>
    <p class="font-italic text-center">Source:<a href="https://finnhub.io"> finnhub.io</a></p>
    `;

    elements.trendsModal.innerHTML = markup;
  }

  hideFavBtn() {
    elements.favoriteBtn.classList.add('d-none');
  }

  showEmptyFavorite() {
    const markup = `
    <p class="text-gray text-uppercase mb-2">
      Your List is empty
    </p>
    `;
    elements.favList.insertAdjacentHTML('beforeend', markup);
  }

  hideEmptyFavoriteMsg() {
    document.querySelector('#favList p').remove();
  }

  updateBalance(balance) {
    const markup = `
    <h2 class="h5 text-uppercase text-gray-500">
    Portfolio Value
    </h2>
    <h2 class="h4 text-uppercase">${balance}</h2>
    `;
    elements.portfolioInfo.insertAdjacentHTML('afterbegin', markup);
  }

  updateCash(cash) {
    //

    const markup = `
    <p class="text-uppercase text-gray-500 mt-5">Cash</p>
    <h5 class="h5 text-uppercase">${cash}</h5>
    `;
    elements.portfolioInfo.insertAdjacentHTML('beforeend', markup);
  }

  displaySResults(data) {
    elements.searchResults.innerHTML = '';
    elements.chartContainer.innerHTML = '';
    data.forEach((item) => {
      const markup = `
      <a href="#${item['1. symbol']}" class="list-group-item list-group-item-action bg-hover-gradient-blue">
      <b>${item['1. symbol']}</b> ${item['2. name']}</a>
      `;
      elements.searchResults.insertAdjacentHTML('beforeend', markup);
    });
  }

  hideSResults() {
    elements.searchResults.innerHTML = '';
  }

  updateStickyInfo(portfolio) {
    elements.stickyCash.innerText = `$${Number(
      portfolio.cash
    ).toLocaleString()}`;
    elements.stickyBalance.innerText = `$${Number(
      portfolio.balance
    ).toLocaleString()}`;
  }

  updatePortfolioInfo(portfolio) {
    elements.cash.innerText = `$${Number(portfolio.cash).toLocaleString()}`;
    elements.balance.innerText = `$${Number(
      portfolio.balance
    ).toLocaleString()}`;
  }

  updateTransModal(stock, type, totalQuantity = 0) {
    // elements.stockOptions.innerHTML = `<option>${stock.symbol}</option>`;
    switch (type) {
      case 'buy':
        elements.transactionType.innerText = 'Review Buy Order';
        break;
      case 'sell':
        elements.transactionType.innerText = 'Review Sell Order';
        break;
    }
    elements.stockChoice.previousElementSibling.innerHTML = `Symbol - Currently ${totalQuantity} Shares Owned`;
    elements.stockChoice.value = `${stock.symbol}`;
    elements.marketPrice.value = `${stock.marketPrice}`;
  }

  updateTotal(quantity) {
    elements.totalCost.value = (
      quantity * elements.marketPrice.value
    ).toLocaleString();
  }

  clearQuantity() {
    elements.quantity.value = '';
    elements.totalCost.value = '';
  }

  addHistory(type, stock) {
    let markup = '';
    if (type === 'bought') {
      markup = `
      <div
      class="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row"
      >
        <div class="left d-flex align-items-center">
          <div class="text">
            <h6 class="mb-0 d-flex align-items-center">
              <span>${stock.symbol}</span>
            </h6>
            <p class="text-gray"><b>${stock.quantity} Shares</b> bought on ${
        stock.time
      }</p>
          </div>
        </div>
        <div class="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-red">
          <h5>-$${stock.cost.toLocaleString()}</h5>
        </div>
      </div>
      `;
      elements.history.insertAdjacentHTML('afterbegin', markup);
    } else {
      markup = `
      <div
      class="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row"
      >
        <div class="left d-flex align-items-center">
          <div class="text">
            <h6 class="mb-0 d-flex align-items-center">
              <span>${stock.symbol}</span>
            </h6>
            <p class="text-gray"><b>${stock.quantity} Shares</b> sold on ${
        stock.time
      }</p>
          </div>
        </div>
        <div class="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-green">
          <h5>+$${stock.earn.toLocaleString()}</h5>
        </div>
      </div>
      `;
      elements.historyCredit.insertAdjacentHTML('afterbegin', markup);
    }
  }

  showAlertModal() {
    $('#alertModal').show('show');
  }

  addToFavList(symbol) {
    const markup = `<button class="btn btn-sm btn-outline-primary mb-2 mr-2">${symbol}</button>`;
    elements.favList.insertAdjacentHTML('afterbegin', markup);
  }

  addPortfolioItem(symbol) {
    const markup = `<button class="btn btn-sm btn-dark mb-2 mr-2">${symbol}</button>`;
    elements.portfolioItems.insertAdjacentHTML('beforeend', markup);
  }
}
