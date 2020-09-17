class Proxy {
  service;
  cache;
  isCache;
  constructor(service) {
    this.service = service;
    this.cache = new Cache();
    this.isCache = config.IS_CACHE;
  }
  async getData(company, timeFrom, timeTo) {
    let key = company + "-" + timeFrom + "-" + timeTo;
    let result = this.isCache ? this.cache.getCacheItem(key) : null;

    if (result == null) {
      let dataPromise = this.service.getData(company, timeFrom, timeTo);

      if (this.isCache) {
        dataPromise.then((d) => {
          this.cache.addCacheItem(key, d);
        });
      }
      result = dataPromise;
    }
    return result;
  }
}
