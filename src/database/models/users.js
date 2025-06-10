const { Schema, model } = require("mongoose");
const chalk = require("chalk");

const UserSchema = new Schema(
  {
    _id: String,
    username: String,
    globalName: String,
    coins: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    reputation: {
      received: { type: Number, default: 0 },
      given: { type: Number, default: 0 },
      timestamp: Date
    },
    daily: {
      streak: { type: Number, default: 0 },
      timestamp: Date
    }
  },
  {
    timestamps: {}
  }
);

class Users {
  /**
   * Base Client to use in this class
   * @param {import("@lib/Bot.js").Bot} client
   */
  constructor(client) {
    this.client = client;
    this.schema = UserSchema;
    this.model = model("user", UserSchema);
  }

  /**
   * A function to get user data from database
   * @param {string} userId
   */
  async get(id) {
    if (!id) throw new Error(`${chalk.yellow("userId")} parameter is missing`);

    const user = this.client.users.cache.get(id);
    if (!user) return;

    var doc = await this.model.findById(id);
    if (!doc) {
      doc = new this.model({
        _id: user.id,
        username: user.username,
        globalName: user.globalName
      });

      await doc.save();
    }

    if (doc.username !== user.username || doc.globalName !== user.globalName) {
      doc.username = user.username;
      doc.globalName = user.globalName;
      await doc.save();
    }

    return doc;
  }

  async delete(id) {}

  async getReputationLevel(limit = 10) {
    return model
      .find({
        "reputation.received": { $gt: 0 }
      })
      .sort({
        "reputation.received": -1,
        "reputation.given": 1
      })
      .limit(limit)
      .lean();
  }
}
module.exports = Users;
