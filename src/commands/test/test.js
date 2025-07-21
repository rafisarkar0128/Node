const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType
} = require("discord.js");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Testing some features.")
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "Testing out some features.",
      examples: ["test"],
      category: "general",
      cooldown: 5,
      global: true,
      guildOnly: false,
      testOnly: true,
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
