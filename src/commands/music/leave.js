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
        .setName("leave")
        .setDescription(t("commands:leave.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "leave",
      examples: ["leave"],
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

    const channelId = player.voiceChannelId;
    player.destroy("Comamnd issued", true);

    embed.setDescription(t("commands:leave.left", { lng, channelId }));
    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
  }
};
