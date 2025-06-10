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
        .setName("pause")
        .setDescription(t("commands:pause.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "pause",
      examples: ["pause"],
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
    const message = interaction.channel.messages.cache.get(
      player.get("messageId")
    );

    if (player?.paused) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:alreadyPaused", { lng }));
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    await player?.pause();
    embed.setDescription(t("player:pause", { lng }));
    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    if (message && message.editable) {
      message.edit({ components: client.utils.buttons.getPlayer(player) });
    }
  }
};
