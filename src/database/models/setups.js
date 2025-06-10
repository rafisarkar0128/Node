const { Schema, model } = require("mongoose");

const SetupSchema = new Schema({
  _id: { type: String, required: true }
});
module.exports = model("schema", SetupSchema);
