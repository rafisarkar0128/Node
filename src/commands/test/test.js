const BaseCommand = require("@structures/BaseCommand.js");
const { SlashCommandBuilder } = require("discord.js");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Testing some features."),
      cetagory: "general",
      cooldown: 0,
      global: true,
      permissions: { dev: true }
    });
  }

  /**
   * Execute function for this command.
   * @param {import("@structures/BotClient.js")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction, lng) {
    await interaction.reply({
      content: `Interaction to string => ${interaction.toString()}`,
      flags: "Ephemeral"
    });
  }
};
