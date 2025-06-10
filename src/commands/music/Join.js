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
        .setName("join")
        .setDescription(t("commands:join.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "join",
      examples: ["join"],
      category: "music",
      cooldown: 5,
      global: true,
      guildOnly: true,
      player: { voice: true },
      permissions: { bot: ["Connect", "Speak"] }
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
    const embed = new EmbedBuilder().setColor(client.color.Good);

    let player = client.lavalink.getPlayer(interaction.guildId);
    if (player) {
      embed.setColor(client.color.Wrong).setDescription(
        t("commands:join.alreadyConnected", {
          lng,
          channelId: player.voiceChannelId
        })
      );
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
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
        vcRegion: voiceChannel?.rtcRegion
      });
    }

    if (!player.connected) await player.connect();
    embed.setDescription(
      t("commands:join.joined", { lng, channelId: player.voiceChannelId })
    );
    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  }
};
