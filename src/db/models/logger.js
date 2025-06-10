const { Schema, model } = require("mongoose");

const schema = new Schema({
  clientId: String,
  info: {
    enabled: Boolean,
    channelId: String,
    roleId: String
  },
  warn: {
    enabled: Boolean,
    channelId: String,
    roleId: String
  },
  error: {
    enabled: Boolean,
    channelId: String,
    roleId: String
  },
  debug: {
    enabled: Boolean,
    channelId: String,
    roleId: String
  },
  success: {
    enabled: Boolean,
    channelId: String,
    roleId: String
  },
  custom: {
    enabled: Boolean,
    channelId: String,
    roleId: String
  }
});

module.exports = model("logger", schema);
