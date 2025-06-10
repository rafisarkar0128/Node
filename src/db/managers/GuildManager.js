const { Collection } = require("discord.js");
const Guild = require("../structures/Guild.js");
const CachedManager = require("./CachedManager.js");

/**
 * Options used to fetch a single guild.
 * @typedef {Object} FetchGuildOptions
 * @property {string} id - The id of the guild to fetch
 * @property {boolean} [cache] - Should this data be added to the cache
 * @property {boolean} [force] - Should directly be fetched from database
 */

/**
 * Options used to fetch multiple guilds.
 * @typedef {Object} FetchGuildsOptions
 * @property {number} [limit] - Maximum number of guilds to request
 */

/**
 * Manages Database methods for Guilds and stores their cache.
 * @extends {CachedManager}
 */
class GuildManager extends CachedManager {
  constructor(client, iterable) {
    super(client, Guild, iterable);
  }

  /**
   * A getter function to get the collection
   * @returns {import("mongodb").Collection}
   * @private
   * @readonly
   */
  get coll() {
    return this.client.db.db().collection("Guild");
  }

  /**
   * A function to get stored guild data from database
   * @param {string} id - id of guild
   * @returns {Promise<Guild>}
   */
  async get(id) {
    const guild = this.client.guilds.cache.get(id);
    if (!guild) return;

    let data = await this.coll.findOne({ _id: guild.id });
    if (!data) data = await this.create(id);

    if (data.name !== guild.name || data.ownerId !== guild.ownerId) {
      data.name = guild.name;
      data.ownerId = guild.ownerId;
      await this.coll.updateOne(
        { _id: guild.id },
        { $push: data },
        { upsert: true }
      );
    }

    return this.add(data, true);
  }

  /**
   * Obtains one or multiple guilds from Database, or the guild cache if it's already available.
   * @param {string|FetchGuildOptions|FetchGuildsOptions} [options] The guild's id or options
   * @returns {Promise<Guild|Collection<string, Guild>>}
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

    const guilds = await this.coll
      .find()
      .limit(options.limit || 200)
      .toArray();
    return guilds.reduce(
      (coll, guild) => coll.set(guild._id, new Guild(this.client, guild)),
      new Collection()
    );
  }

  /**
   * A function to create guild data for database
   * @param {string} is - id of the guild
   * @returns {Promise<Guild>}
   */
  async create(id) {
    const guild = this.client.guilds.cache.get(id);
    if (!guild || (await this.coll.findOne({ _id: id }))) return;
    await this.client.db.users.create(guild.ownerId);

    const data = {
      _id: guild.id,
      name: guild.name,
      ownerId: guild.ownerId,
      locale: this.client.config.defaultLocale,
      prefix: this.client.config.bot.prefix,
      rank: {
        enabled: false,
        message: this.client.config.rank.defaultMessage,
        channel: null,
        rewards: []
      },
      joinedAt: guild.joinedAt,
      leftAt: null,
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
   * @returns {Promise<import("mongodb").UpdateResult>}
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
    // this.add(data, true);
    return result;
  }

  /**
   * A function to get the guild locale
   * @param {string} guildId
   * @returns {Promise<string>}
   */
  async getLocale(guildId) {
    let { locale } = await this.get(guildId);
    if (!locale) locale = this.client.config.defaultLocale;
    return locale;
  }
}

module.exports = GuildManager;
