const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder
} = require("discord.js");
const { t } = require("i18next");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("replay")
        .setDescription(t("commands:replay.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "replay",
      examples: ["replay"],
      category: "music",
      cooldown: 5,
      global: true,
      guildOnly: true,
      player: { voice: true, active: true, playing: true }
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

    if (!player.queue.current?.info.isSeekable) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:notReplayable", { lng }));
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    await player.seek(0);
    embed.setDescription(t("player:replaying", { lng }));
    await interaction.reply({ embeds: [embed] });
  }
};
