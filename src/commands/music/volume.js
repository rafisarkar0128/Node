const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder
} = require("discord.js");
const { t } = require("i18next");
const config = require("@src/config.js");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription(t("commands:volume.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription(t("commands:volume.options.number"))
            .setMinValue(0)
            .setMaxValue(config.music.maxVolume)
            .setRequired(true)
        ),
      usage: "volume <number>",
      examples: ["volume 100"],
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
    const player = client.lavalink.getPlayer(interaction.guildId);
    const embed = new EmbedBuilder().setColor(client.color.Good);
    const number = interaction.options.getInteger("number", true);
    const message = interaction.channel.messages.cache.get(
      player.get("messageId")
    );

    if (number > config.music.maxVolume) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("commands:volume.tooHigh", { lng }));
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    const { volume } = await player.setVolume(number);
    embed.setDescription(t("commands:volume.setVolume", { lng, volume }));
    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    if (message && message.editable) {
      message.edit({ components: client.utils.buttons.getPlayer(player) });
    }
  }
};
