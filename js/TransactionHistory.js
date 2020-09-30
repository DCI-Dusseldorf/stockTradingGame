export default class TransactionHistory {
  constructor() {
    this.render();
  }
  render() {
    const markup = `<table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">Symbol</th>
        <th scope="col">Buy/Sell</th>
        <th scope="col">Trx-Price</th>
        <th scope="col">Quantity</th>
        <th scope="col">Value</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>`;
    $("#transactionHistory").html(markup);

    const transaction = JSON.parse(localStorage.getItem("myPortfolio"));
    let trnMarkup = "";
    let trxType = "";
    transaction.forEach(([symbol, { buyPrice, quantity }]) => {
      if (quantity < 0) {
        trxType = "Sell";
      } else {
        trxType = "Buy";
      }
      trnMarkup += `<tr>
        <th scope="row">${symbol}</th>
        <td>${trxType}</td>
        <td>${Number(buyPrice).toFixed(2)}</td>
        <td>${Math.abs(quantity)}</td>
        <td>${Math.abs(buyPrice * quantity).toFixed(2)}</td>
      </tr>`;

      $("#transactionHistory tbody").html(trnMarkup);
    });
  }
}
