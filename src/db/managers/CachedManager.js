const BaseManager = require("./BaseManager.js");

/**
 * Manages the API methods of a data model with a mutable cache of instances.
 * @extends {BaseManager}
 * @abstract
 */
class CachedManager extends BaseManager {
  constructor(client, holds, iterable) {
    super(client, holds);

    /**
     * The private cache of items for this manager.
     * @type {import("lru-cache").LRUCache<string, any, any>}
     * @private
     * @readonly
     */
    this._cache = this.client.utils.makeCache(this.constructor, holds);

    if (iterable) {
      for (const item of iterable) {
        this.add(item);
      }
    }
  }

  /**
   * The cache of items for this manager.
   * @type {import("lru-cache").LRUCache<string, any, any>}
   * @abstract
   */
  get cache() {
    return this._cache;
  }

  /**
   * A function to add data to the cache
   * @param {any} data
   * @param {boolean} [cache]
   * @param {{id?:string, extra?:any[]}} [param2]
   * @returns {any}
   * @private
   */
  add(data, cache = true, { id, extras = [] } = {}) {
    const existing = this.cache.get(id ?? data.id);
    if (existing) {
      if (cache) {
        // existing._patch(data);
        return existing;
      }
      const clone = existing._clone();
      clone._patch(data);
      return clone;
    }

    const entry =
      this.holds ? new this.holds(this.manager, data, ...extras) : data;
    if (cache) this.cache.set(id ?? entry.id, entry);
    return entry;
  }
}

module.exports = CachedManager;
