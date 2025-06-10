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
        .setName("skip")
        .setDescription(t("commands:skip.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription(t("commands:skip.options.number"))
            .setMinValue(1)
            .setRequired(false)
        ),
      usage: "skip",
      examples: ["skip"],
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
    const number = interaction.options.getInteger("number");

    if (player.queue.tracks.length === 0) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:noTrack", { lng }));
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    if (number && number > player.queue.tracks.length) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("commands:skip.invalidNumber", { lng }));
      return await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }

    if (number) {
      await player.skip(number);
      embed.setDescription(t("player:skipTo", { lng, number }));
    } else {
      await player.skip();
      embed.setDescription(t("player:skip", { lng }));
    }

    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  }
};
