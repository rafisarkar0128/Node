const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
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
        .setName("search")
        .setDescription(t("commands:search.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription(t("commands:search.options.query"))
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("source")
            .setDescription(t("commands:search.options.source"))
            .setRequired(false)
            .addChoices([
              {
                name: "Apple Music",
                value: "applemusic:amsearch"
              },
              {
                name: "Bandcamp",
                value: "bandcamp:bcsearch"
              },
              {
                name: "Dezeer",
                value: "dezeer:dzsearch"
              },
              {
                name: "JioSaavn",
                value: "jiosaavn:jssearch"
              },
              {
                name: "Sound Cloud",
                value: "soundcloud:scsearch"
              },
              {
                name: "Spotify",
                value: "spotify:spsearch"
              },
              {
                name: "Yandex Music",
                value: "yandexmusic:ymsearch"
              },
              {
                name: "YouTube",
                value: "youtube:ytsearch"
              },
              {
                name: "YouTube Music",
                value: "youtube:ytmsearch"
              },
              {
                name: "VK Music",
                value: "vkmusic:vksearch"
              },
              {
                name: "Tidal",
                value: "tidal:tdsearch"
              },
              {
                name: "Qobuz",
                value: "qobuz:qbsearch"
              }
            ])
        ),
      usage: "search <query>",
      examples: ["search query:Bad Liar"],
      category: "music",
      cooldown: 5,
      global: true,
      guildOnly: true,
      player: { voice: true, active: false }
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
    let player = client.lavalink.getPlayer(interaction.guildId);
    const embed = new EmbedBuilder().setColor(client.color.Good);
    const query = interaction.options.getString("query", true);

    const src = interaction.options.getString("source", false) ?? undefined;
    let source = undefined;
    let nodes = client.lavalink.nodeManager.leastUsedNodes();

    if (src) {
      const [sourceName, searchSource] = src.split(/:/g);
      source = searchSource;
      nodes = nodes.filter((n) => n.info.sourceManagers.includes(sourceName));
      if (nodes.length <= 0) {
        embed
          .setColor(client.color.Wrong)
          .setDescription(t("player:noSource", { lng, source: sourceName }));
        return await interaction.followUp({ embeds: [embed] });
      }
    }

    if (!player) {
      const voiceChannel = interaction.member.voice.channel;
      player = client.lavalink.createPlayer({
        guildId: interaction.guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: client.config.music.defaultVolume,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false,
        vcRegion: voiceChannel?.rtcRegion,
        node: nodes[Math.floor(Math.random() * nodes.length)]
      });
    }
    if (!player.connected) await player.connect();

    const response = await player.search({ query, source }, interaction.user);
    if (
      !response ||
      ["empty", "error"].includes(response.loadType) ||
      response.tracks?.length === 0
    ) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:emptyResult", { lng }));
      return await interaction.followUp({
        embeds: [embed],
        flags: "Ephemeral"
      });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select-track")
      .setPlaceholder(t("player:selectTrack", { lng }))
      .addOptions(
        response.tracks.slice(0, 10).map((track, index) => {
          let label = `${index + 1}. ${track.info.title}`;
          let description = track.info.author;
          return {
            label: client.utils.sliceString(label, 100),
            description: client.utils.sliceString(description, 33),
            value: index.toString()
          };
        })
      );
    const row = new ActionRowBuilder().setComponents(selectMenu);

    if (["search", "playlist"].includes(response.loadType)) {
      const tracks = response.tracks.slice(0, 10).map((track, index) => {
        let title = client.utils.sliceString(track.info.title, 50);
        let author = client.utils.sliceString(track.info.author, 30);
        return `${index + 1}. [${title}](${track.info.uri}) - \`${author}\``;
      });
      embed.setDescription(tracks.join("\n"));
      await interaction.followUp({ embeds: [embed], components: [row] });
    } else {
      const track = response.tracks[0];
      if (!track) return;

      let position = await player.queue.add(track);
      if (!player.playing) await player.play({ paused: false });

      embed.setDescription(
        t("player:addTrack", {
          lng,
          position,
          track: `[${track.info.title}](<${track.info.uri}>)`
        })
      );

      await interaction.followUp({ embeds: [embed], components: [] });
    }

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (int) => int.user.id === interaction.user.id,
      max: 1,
      time: 60000,
      idle: 60000 / 2
    });

    collector.on("collect", async (int) => {
      await int.deferUpdate();

      const track = response.tracks[Number.parseInt(int.values[0])];
      if (!track) return;

      let position = await player.queue.add(track);
      if (!player.playing) await player.play({ paused: false });

      embed.setDescription(
        t("player:addTrack", {
          lng,
          position,
          track: `[${track.info.title}](<${track.info.uri}>)`
        })
      );

      await interaction.followUp({ embeds: [embed], components: [] });
      return collector.stop();
    });

    collector.on("end", async () => {
      await interaction.editReply({ components: [] });
    });
  }
};
