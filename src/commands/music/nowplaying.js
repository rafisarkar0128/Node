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
        .setName("nowplaying")
        .setDescription(t("commands:nowplaying.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "nowplaying",
      examples: ["nowplaying"],
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

    const track = player.queue.current;
    const position = player.position;
    const duration = track.info.duration;
    const bar = client.utils.progressBar(position, duration, 20);

    const titleString = `**[${`${client.utils.sliceString(track.info.title, 20)}`}](<${track.info.uri}>)**`;
    const durationString = `\`${client.utils.formatTime(position)} / ${
      track.info.isStream ?
        t("player:live", { lng })
      : client.utils.formatTime(track.info.duration)
    }\``;

    const embed = new EmbedBuilder()
      .setColor(client.color.Good)
      .setAuthor({
        name: t("player:nowPlaying", { lng }),
        iconURL: interaction.guild?.iconURL({ extension: "png" })
      })
      .setThumbnail(track.info.artworkUrl)
      .setDescription(
        [
          `${t("player:currentTrackInfo", {
            lng,
            track: titleString,
            duration: durationString
          })} `,
          `- ${t("player:requestedBy", { lng, user: `<@${track.requester.id}>` })}`,
          `\n${bar}`
        ].join("\n")
      );
    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  }
};
