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
        .setName("remove")
        .setDescription(t("commands:remove.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription(t("commands:remove.options.number"))
            .setRequired(true)
        ),
      usage: "remove <number>",
      examples: ["remove 10", "remove 2"],
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

    if (player.queue.tracks.length === 0) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:noTrack", { lng }));
      return await interaction.reply({ embeds: [embed] });
    }

    if (number <= 0 || number > player.queue.tracks.length) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(t("player:invalidTrackNumber", { lng }));
      return await interaction.reply({ embeds: [embed] });
    }

    await player.queue.remove(number - 1);
    embed.setDescription(t("player:removed", { lng, number }));
    await interaction.reply({ embeds: [embed] });
  }
};
