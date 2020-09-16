function init() {
  // const service = new FinnHubService(token);

  const service = new Proxy(new FinnHubService());

  let timeFrom = Date.parse("2020-01-01T03:24:00") / 1000;
  let timeTo = Date.parse("2020-11-15T03:24:00") / 1000;

  service.getData("IBM", timeFrom, timeTo).then((data) => {
    console.log(data);
    document.body.innerText = JSON.stringify(data);
  });
}
