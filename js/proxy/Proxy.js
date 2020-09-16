class Proxy {
  service;
  cache;
  constructor(service) {
    this.service = service;
    this.cache = new Cache();
  }
  async getData(company, timeFrom, timeTo) {
    let key = company + "-" + timeFrom + "-" + timeTo;
    let result = this.cache.getCacheItem(key);
    if (result == null) {
      let dataPromise = this.service.getData(company, timeFrom, timeTo);
      dataPromise.then((d) => {
        this.cache.addCacheItem(key, d);
      });
      result = dataPromise;
    }
    return result;
  }
}
