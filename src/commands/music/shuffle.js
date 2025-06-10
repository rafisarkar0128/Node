const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder
} = require("discord.js");
const { t } = require("i18next");
const config = require("@src/config.js");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription(t("commands:shuffle.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "shuffle <number>",
      examples: ["shuffle 100"],
      category: "music",
      cooldown: 5,
      global: true,
      guildOnly: true,
      player: { voice: true, active: true }
    });
  }

  /**
   * Execute function for this command.
   * @param {import("@structures/BotClient.js")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {string} lng
   * @returns {Promise<void>}
   */
  async execute(client, interaction, lng) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    const embed = new EmbedBuilder().setColor(client.color.Good);

    if (player.queue.tracks.length === 0) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:noTrack", { lng }));
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    await player.queue.shuffle();
    embed.setDescription(t("commands:shuffle.shuffked", { lng }));
    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  }
};
