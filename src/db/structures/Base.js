const { flatten } = require("discord.js");

/**
 * Represents a data model that is identifiable by a Snowflake
 * @abstract
 */
class Base {
  constructor(client) {
    /**
     * The client that instantiated this Manager
     * @type {import("@structures/BotClient.js")}
     * @readonly
     */
    this.client = client;
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _patch(data) {
    return data;
  }

  _update(data) {
    const clone = this._clone();
    this._patch(data);
    return clone;
  }

  toJSON(...props) {
    return flatten(this, ...props);
  }

  valueOf() {
    return this.id;
  }
}

module.exports = Base;
