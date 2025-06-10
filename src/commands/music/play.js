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
        .setName("play")
        .setDescription(t("commands:play.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription(t("commands:play.options.query"))
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
        )
        .addBooleanOption((option) =>
          option
            .setName("play_next")
            .setDescription(t("commands:play.options.play_next"))
            .setRequired(false)
        ),
      usage: "play <song|url>",
      examples: [
        "play example",
        "play https://www.youtube.com/watch?v=example",
        "play https://open.spotify.com/track/example",
        "play http://www.example.com/example.mp3"
      ],
      category: "music",
      cooldown: 5,
      global: true,
      guildOnly: true,
      player: { voice: true },
      permissions: {
        bot: ["Connect", "Speak"],
        user: ["SendMessages", "Connect"]
      }
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

    const { options, channelId, guildId } = interaction;
    let player = client.lavalink.getPlayer(guildId);
    const embed = new EmbedBuilder().setColor(client.color.Good);
    const query = options.getString("query", true);
    const playNext = options.getBoolean("play_next", false);
    const vc = interaction.member.voice?.channel;

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
      player = client.lavalink.createPlayer({
        guildId: guildId,
        voiceChannelId: vc.id,
        textChannelId: channelId,
        selfDeaf: true,
        selfMute: false,
        volume: client.config.music.defaultVolume,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false,
        vcRegion: vc?.rtcRegion,
        node: nodes[Math.floor(Math.random() * nodes.length)]
      });
    }
    if (!player.connected) await player.connect();

    const res = await player.search({ query, source }, interaction.user);

    if (!res || res.loadType === "error") {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:loadFailed", { lng }));
      await interaction.followUp({ embeds: [embed] });
      return setTimeout(() => interaction.deleteReply(), 5_000);
    }

    if (!res.tracks?.length || res.loadType === "empty") {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:emptyResult", { lng }));
      await interaction.followUp({ embeds: [embed] });
      return setTimeout(() => interaction.deleteReply(), 5_000);
    }

    if (res.loadType === "playlist") {
      if (playNext) {
        await player.queue.splice(0, 0, res.tracks);
      } else {
        await player.queue.add(res.tracks);
      }

      embed.setDescription(
        t("player:addPlaylist", {
          lng,
          size: res.tracks.length,
          title: res.playlist?.name ? res.playlist.name : "playlist"
        })
      );
      await interaction.followUp({ embeds: [embed] });
    } else {
      let track = res.tracks.shift();
      let position = 0;

      if (playNext) {
        position = await player.queue.splice(0, 0, track);
      } else {
        position = await player.queue.add(track);
      }

      embed.setColor(client.color.Good).setDescription(
        t("player:addTrack", {
          lng,
          position,
          track: `[${track.info.title}](<${track.info.uri}>)`
        })
      );
      await interaction.followUp({ embeds: [embed] });
    }

    if (!player.playing) await player.play({ paused: false });
  }
};
