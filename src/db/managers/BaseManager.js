/**
 * Manages the database methods.
 * @abstract
 */
class BaseManager {
  constructor(client) {
    /**
     * The database manager that instantiated this Manager
     * @type {import("@structures/BotClient.js")}
     * @readonly
     */
    this.client = client;
  }
}

module.exports = BaseManager;
