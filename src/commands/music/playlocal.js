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
        .setName("playlocal")
        .setDescription(t("commands:playlocal.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addAttachmentOption((option) =>
          option
            .setName("file")
            .setDescription(t("commands:playlocal.options.file"))
            .setRequired(true)
        ),
      usage: "playlocal <file>",
      examples: ["playlocal <file>"],
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
    const file = options.getAttachment("file", true);
    const vc = interaction.member.voice?.channel;
    const nodes = client.lavalink.nodeManager.leastUsedNodes();

    if (!file) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:noFile", { lng }));
      return await interaction.followUp({ embeds: [embed] });
    }

    const audioExtensions = [".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!audioExtensions.includes(`.${extension}`)) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:invalidFormat", { lng }));
      return await interaction.followUp({ embeds: [embed] });
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

    const res = await player.search(
      { query: file.url, source: "local" },
      interaction.user
    );

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

    const position = await player.queue.add(res.tracks[0]);
    embed.setColor(client.color.Good).setDescription(
      t("player:addTrack", {
        lng,
        position,
        track: `[${file.name}](<${file.url}>)`
      })
    );

    await interaction.followUp({ embeds: [embed] });
    if (!player.playing) await player.play({ paused: false });
  }
};
