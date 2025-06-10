const Base = require("./Base.js");

/**
 * Represents a discord user on Database.
 * @extends {Base}
 */
class User extends Base {
  constructor(client, data) {
    super(client);

    // this._patch(data);

    /**
     * The id of the guild
     * @type {string}
     * @readonly
     */
    this.id = data._id;

    /**
     * The name of the guild
     * @type {string}
     * @readonly
     */
    this.username = data.username;

    /**
     * The user's email address
     * @type {string|null}
     * @readonly
     */
    this.email = data.email || null;

    /**
     * The user's last login timestamp
     * @type {Date|null}
     * @readonly
     */
    this.lastLogin = data.lastLogin || null;

    /**
     * The amount of coins the user has
     * @type {number}
     * @readonly
     */
    this.coins = data.coins;

    /**
     * The amount of coins the user has in bank
     * @type {number}
     * @readonly
     */
    this.bank = data.bank;

    /**
     * The amount of xp the user has
     * @type {number}
     * @readonly
     */
    this.xp = data.xp;

    /**
     * The level the user has reached through xp
     * @type {number}
     * @readonly
     */
    this.level = data.level;

    /**
     * The guild owner id
     * @type {string}
     * @readonly
     */
    this.ownerId = data.ownerId;

    /**
     * The time the guild schema was created
     * @type {Date}
     * @readonly
     */
    this.createdAt = data.createdAt;

    /**
     * The time this schema was last updated
     * @type {Date}
     * @readonly
     */
    this.updatedAt = data.updatedAt;

    if ("reputation" in data) {
      const reputation = {
        received: data.reputation?.received || 0,
        given: data.reputation?.given || 0,
        timestamp: null
      };

      /**
       * The reputation object of the user
       * @typedef {object} ReputationObject
       * @property {number} received - The amount of reputation received
       * @property {number} given - The amount of reputation given
       * @property {number} timestamp - The timestamp of the last reputation update
       */

      /**
       * The reputation the user has received or given
       * @type {ReputationObject}
       * @readonly
       */
      this.reputation = reputation;
    }

    if ("daily" in data) {
      const daily = {
        streak: data.daily?.streak || 0,
        claimed: data.daily?.claimed || false,
        amount: data.daily?.amount || 0,
        bonus: data.daily?.bonus || 0,
        lastClaimed: data.daily?.lastClaimed
      };

      /**
       * The daily object of the user
       * @typedef {object} DailyObject
       * @property {number} streak - The amount of daily streaks the user has
       * @property {Date} lastClaimed - The timestamp of the last daily claimed
       * @property {boolean} claimed - Whether the user has claimed their daily reward or not
       * @property {number} amount - The amount of coins the user has received from the daily reward
       * @property {number} bonus - The amount of bonus coins the user has received from the daily reward
       */

      /**
       * The user daily stats
       * @type {DailyObject}
       */
      this.daily = daily;
    }
  }
}

module.exports = User;
