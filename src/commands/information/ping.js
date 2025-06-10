const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType
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
        .setName("ping")
        .setDescription(t("commands:ping.description"))
        .setContexts(
          InteractionContextType.Guild,
          InteractionContextType.BotDM,
          InteractionContextType.PrivateChannel
        )
        .setIntegrationTypes(
          ApplicationIntegrationType.GuildInstall,
          ApplicationIntegrationType.UserInstall
        ),
      usage: "ping",
      examples: ["ping"],
      cetagory: "information",
      cooldown: 5,
      global: true
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
    const reply = await interaction.deferReply({ withResponse: true });

    const response =
      reply.resource.message.createdTimestamp - interaction.createdTimestamp;
    const gateway = client.ws.ping;
    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor(client.uptime / 3600000) % 24;
    const minutes = Math.floor(client.uptime / 60000) % 60;
    const seconds = Math.floor(client.uptime / 1000) % 60;
    const embed = new EmbedBuilder()
      .setColor(client.color.Transparent)
      .addFields([
        {
          name: t("commands:ping.gatewayPing", { lng }),
          value: `\`\`\`yml\n${
            gateway <= 200 ? "🟢"
            : gateway <= 400 ? "🟡"
            : "🔴"
          } ${gateway}ms\`\`\``,
          inline: true
        },
        {
          name: t("commands:ping.responseTime", { lng }),
          value: `\`\`\`yml\n${
            response <= 200 ? "🟢"
            : response <= 400 ? "🟡"
            : "🔴"
          } ${response}ms\`\`\``,
          inline: true
        },
        {
          name: t("commands:ping.uptime", { lng }),
          value: `\`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\n\`\`\``,
          inline: false
        }
      ]);

    await interaction.followUp({ embeds: [embed] });
  }
};
