class Cache {
  addCacheItem(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getCacheItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}
