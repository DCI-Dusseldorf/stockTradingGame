import Cache from "./Cache.js";
import Config from "../Config.js";
import MockData from "./MockData.js";

export default class Proxy {
  #service;
  #cache;
  #isCache = Boolean;
  #isMock = Boolean;
  #cacheKey = String;
  constructor(service) {
    this.service = service;
    this.cache = new Cache();
    this.isCache = Config.IS_CACHE;
    this.isMock = Config.IS_MOCK_DATA;
  }
  async getData(company, timeFrom, timeTo) {
    this.cacheKey = this.setCacheKey(company, timeFrom, timeTo);
    let data = this.isCache ? this.cache.getCacheItem(this.cacheKey) : null;
    data = this.isMock ? this.getMockData() : null;

    if (data == null) {
      let dataPromise = this.service.getData(company, timeFrom, timeTo);

      if (this.isCache) {
        this.cache.addCacheItem(this.cacheKey, dataPromise);
      }
      data = dataPromise;
    }
    return data;
  }

  getMockData() {
    let mockData = MockData.getData();
    if (this.isCache) {
      this.cache.addCacheItem(this.cacheKey, mockData);
    }
    return mockData;
  }

  setCacheKey(company, timeFrom, timeTo) {
    return this.isMock ? "MOCK-CACHE-KEY" : company + "-" + timeFrom + "-" + timeTo;
  }
}
