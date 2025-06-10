const { SlashCommandBuilder } = require("discord.js");

/** @type {import("@types/index").CommandStructure} */
module.exports = {
  data: new SlashCommandBuilder(),
  usage: "",
  category: "none",
  cooldown: 0,
  global: true,
  premium: false,
  devOnly: false,
  disabled: false,
  ephemeral: true,
  voiceChannelOnly: false,
  botPermissions: [],
  userPermissions: [],
  async execute(client, interaction, lng) {},
  async autocomplete(client, interaction) {}
};
