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
        .setName("seek")
        .setDescription(t("commands:seek.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription(t("commands:skip.options.duration"))
            .setRequired(true)
        ),
      usage: "seek <duration>",
      examples: ["seek 1m, seek 1h 30m", "seek 1h 30m 30s"],
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
    await interaction.deferReply({ flags: "Ephemeral" });
    const player = client.lavalink.getPlayer(interaction.guildId);
    const embed = new EmbedBuilder().setColor(client.color.Good);
    const duration = client.utils.parseTime(
      interaction.options.getString("duration", true)
    );

    if (!duration) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:invalidSeekFormat", { lng }));
      return await interaction.followUp({ embeds: [embed] });
    }

    const track = player.queue.current;
    if (!track.info.isSeekable || track.info.isStream) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:notSeekable", { lng }));
      return await interaction.followUp({ embeds: [embed] });
    }

    if (duration > track.info.duration) {
      embed.setColor(client.color.Wrong).setDescription(
        t("player:beyondDuration", {
          lng,
          duration: client.utils.formatTime(track.info.duration)
        })
      );
      return await interaction.followUp({ embeds: [embed] });
    }

    await player.seek(duration);
    embed.setDescription(
      t("player:seekedTo", {
        lng,
        duration: client.utils.formatTime(duration)
      })
    );
    await interaction.followUp({ embeds: [embed] });
  }
};
