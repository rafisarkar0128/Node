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
        .setName("roleinfo")
        .setDescription(t("commands:roleinfo.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription(t("commands:roleinfo.options.role"))
            .setRequired(true)
        ),
      usage: "roleinfo <role>",
      examples: [
        "roleinfo <id | mention>",
        "roleinfo 1055796788587659284",
        "roleinfo <@&1055796788587659284>"
      ],
      category: "information",
      cooldown: 30,
      global: true,
      guildOnly: true
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
    const role = interaction.options.getRole("role", true);
    const embed = new EmbedBuilder()
      .setColor(role.hexColor)
      .setThumbnail(role.icon ? role.iconURL() : null)
      .addFields([
        {
          name: t("commands:roleinfo.role", { lng }),
          value: `- ${role}`,
          inline: true
        },
        {
          name: t("commands:roleinfo.id", { lng }),
          value: `- ${role.id}`,
          inline: true
        },
        {
          name: t("commands:roleinfo.createdOn", { lng }),
          value: [
            "-",
            `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`,
            "|",
            `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`
          ].join(" "),
          inline: false
        },
        {
          name: t("commands:roleinfo.mentionable", { lng }),
          value: `- ${role.mentionable ? "Yes" : "No"}`,
          inline: true
        },
        {
          name: t("commands:roleinfo.hoisted", { lng }),
          value: `- ${role.hoist ? "Yes" : "No"}`,
          inline: true
        },
        {
          name: t("commands:roleinfo.botRole", { lng }),
          value: `- ${role.managed ? "Yes" : "No"}`,
          inline: true
        },
        {
          name: t("commands:roleinfo.color", { lng }),
          value: `- ${role.hexColor}`,
          inline: true
        },
        {
          name: t("commands:roleinfo.members", { lng }),
          value: `- ${role.members.size}`,
          inline: true
        },
        {
          name: t("commands:roleinfo.position", { lng }),
          value: `- ${interaction.guild.roles.cache.size - role.position}`,
          inline: true
        }
      ]);

    await interaction.reply({ embeds: [embed] });
  }
};
