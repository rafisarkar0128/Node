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
        .setName("queue")
        .setDescription(t("commands:queue.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addSubcommand((option) =>
          option
            .setName("view")
            .setDescription(t("commands:queue.subcommands.view"))
        )
        .addSubcommand((option) =>
          option
            .setName("clear")
            .setDescription(t("commands:queue.subcommands.clear"))
        ),
      usage: "queue <subcommand> [options]",
      examples: ["queue view", "queue clear"],
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
    await interaction.deferReply();

    const player = client.lavalink.getPlayer(interaction.guildId);
    const embed = new EmbedBuilder().setColor(client.color.Good);
    const subcommand = interaction.options?.getSubcommand(true);
    const { guild } = interaction;

    if (subcommand === "view") {
      embed.setAuthor({
        name: t("player:queueTitle", {
          lng,
          guild: guild.name,
          length: player.queue.tracks.length
        }),
        iconURL: guild.iconURL({ extension: "png" })
      });

      const songStrings = [];
      let current = player.queue.current;
      if (player.queue.current && player.queue.tracks.length === 0) {
        embed.setDescription(":x: There are no tracks in the queue").addFields({
          name: t("player:nowPlaying", { lng }),
          value: `${t("player:currentTrackInfo", {
            lng,
            track: `**[${current.info.title}](<${current.info.uri}>)**`,
            duration:
              current.info.isStream ?
                t("player:live", { lng })
              : client.utils.formatTime(current.info.duration)
          })}`
        });
        return await interaction.followUp({ embeds: [embed] });
      } else {
        for (let i = 0; i < player.queue.tracks.length; i++) {
          const track = player.queue.tracks[i];
          const titleString = `**[${`${client.utils.sliceString(track.info.title, 33)}`}](<${track.info.uri}>)**`;
          songStrings.push(
            t("player:queueTrackInfo", {
              index: i + 1,
              track: titleString,
              duration:
                track.info.isStream ?
                  t("player:live", { lng })
                : client.utils.formatTime(track.info.duration)
            })
          );
        }
      }

      let chunks = client.utils.chunk(songStrings, 10);
      if (chunks.length === 0) chunks = [songStrings];

      const pages = chunks.map((chunk, index) => {
        return new EmbedBuilder()
          .setAuthor({
            name: t("player:queueTitle", {
              lng,
              guild: guild.name,
              length: player.queue.tracks.length
            }),
            iconURL: guild.iconURL({ extension: "png" })
          })
          .setDescription(chunk.join("\n"))
          .setFooter({
            text: t("misc:pageInfo", {
              lng,
              index: index + 1,
              total: chunks.length
            })
          });
      });

      return await client.utils.paginate(interaction, pages, lng);
    }

    if (subcommand === "clear") {
      if (player.queue.tracks.length === 0) {
        embed
          .setColor(client.color.Wrong)
          .setDescription(t("player:noTrack", { lng }));
        return await interaction.followUp({ embeds: [embed] });
      }

      player.queue.tracks.splice(0, player.queue.tracks.length);
      embed.setDescription(t("player:queueCleared", { lng }));
      return await interaction.followUp({ embeds: [embed] });
    }
  }
};
