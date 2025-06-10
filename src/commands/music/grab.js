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
        .setName("grab")
        .setDescription(t("commands:grab.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "grab",
      examples: ["grab"],
      category: "music",
      cooldown: 5,
      global: true,
      guildOnly: true,
      premium: true,
      player: { active: true, playing: true }
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
    const embed = new EmbedBuilder();
    const song = player.queue.current;
    const songEmbed = new EmbedBuilder()
      .setColor(client.color.Normal)
      .setTitle(`**${song.info.title}**`)
      .setURL(song.info.uri)
      .setThumbnail(song.info.artworkUrl)
      .setDescription(
        t("commands:grab.content", {
          lng,
          artist: client.utils.sliceString(song.info.author, 24),
          length:
            song.info.isStream ?
              "LIVE"
            : client.utils.formatTime(song.info.duration),
          requester: song.requester.id
        })
      );

    try {
      await interaction.user.send({ embeds: [songEmbed] });
      embed
        .setColor(client.color.Good)
        .setDescription(t("commands:grab.checkDM", { lng }));
    } catch (_e) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("commands:grab.DMfailed", { lng }));
    }

    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  }
};
