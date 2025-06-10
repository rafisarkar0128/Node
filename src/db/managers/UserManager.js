const { Collection } = require("discord.js");
const CachedManager = require("./CachedManager.js");
const User = require("../structures/User.js");

/**
 * Options used to fetch a single user.
 * @typedef {Object} FetchUserOptions
 * @property {boolean} [cache]
 * @property {boolean} [force]
 * @property {string} id - The id of the user to fetch
 */

/**
 * Options used to fetch multiple users.
 * @typedef {Object} FetchUsersOptions
 * @property {number} [limit] Maximum number of users to request
 */

/**
 * Manages Database methods for Users and stores their cache.
 * @extends {CachedManager}
 */
module.exports = class UserManager extends CachedManager {
  constructor(client, iterable) {
    super(client, User, iterable);
  }

  /**
   * A getter function to get the collection
   * @returns {import("mongodb").Collection}
   * @private
   * @readonly
   */
  get coll() {
    return this.client.db.db().collection("User");
  }

  /**
   * A function to get stored user data from database
   * @param {string} id - id of the user
   * @returns {Promise<User>}
   */
  async get(id) {
    const user = await this.client.users.fetch(id);
    if (!user) return;

    let data = await this.coll.findOne({ _id: user.id });
    if (!data) data = await this.create(id);

    if (data.username !== user.username) {
      data.username = user.username;
      await this.coll.updateOne(
        { _id: user.id },
        { $push: data },
        { upsert: true }
      );
    }

    return this.add(data, true);
  }

  /**
   * Obtains one or multiple users from Database, or the user cache if it's already available.
   * @param {string|FetchUserOptions|FetchUsersOptions} [options] The user's id or options
   * @returns {Promise<Guild|Collection<string, User>>}
   */
  async fetch(options = {}) {
    let id = options.id;
    if (typeof options === "string") id = options;

    if (id) {
      if (!options.force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }
      const data = await this.coll.findOne({ _id: id });
      if (data) return this.add(data, options.cache);
    }

    const users = await this.coll
      .find()
      .limit(options.limit || 200)
      .toArray();
    return users.reduce(
      (coll, user) => coll.set(user._id, new User(this.client, user)),
      new Collection()
    );
  }

  /**
   * A function to create user data for database
   * @param {string} is - id of the user
   * @returns {Promise<User>}
   */
  async create(id) {
    const user = await this.client.users.fetch(id);
    if (!user || user.bot || (await this.coll.findOne({ _id: id }))) return;

    const data = {
      _id: user.id,
      username: user.username,
      email: null,
      coins: 0,
      bank: 0,
      xp: 0,
      level: 0,
      reputation: {
        received: 0,
        given: 0,
        timestamp: null
      },
      daily: {
        streak: 0,
        claimed: false,
        amount: 0,
        bonus: 0,
        lastClaimed: null
      },
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.coll.insertOne(data);
    return this.add(data, true);
  }

  /**
   * A function to update the database
   * @param {string} id
   * @param {string} key
   * @param {string|object|Array|number|boolean|any} value
   * @returns {import("mongodb").UpdateResult}
   */
  async update(id, key, value) {
    if (!id || typeof id !== "string") {
      throw new TypeError(
        `Parameter "id" has to be present and must be a string.`
      );
    }
    const update = { $set: { [key]: value, updatedAt: new Date() } };
    const result = await this.coll.updateOne({ _id: id }, update, {
      upsert: true
    });
    return result;
  }

  async getReputationLevel(limit = 10) {
    return this.collection
      .find((doc) => {
        return doc.reputation.received > 0;
      })
      .sort(["ascending"], -1)
      .limit(limit);

    // {-1 : 1 }
  }
};
