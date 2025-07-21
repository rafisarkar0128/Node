const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
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
        .setName("about")
        .setDescription(t("commands:about.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "about",
      examples: ["about"],
      category: "information",
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
    await interaction.deferReply();

    const actionRow = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel(t("misc:buttons.support", { lng }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.supportServer),
      new ButtonBuilder()
        .setLabel(t("misc:buttons.website", { lng }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.botWebsite),
      new ButtonBuilder()
        .setLabel(t("misc:buttons.invite", { lng }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.utils.invites.getBot())
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.avatarURL({ extension: "png" })
      })
      .setThumbnail(client.user.avatarURL({ extension: "png" }))
      .setColor(client.color.Main)
      .addFields(
        {
          name: t("commands:about.fields.creator", { lng }),
          value: "[rafisarkar0128](https://github.com/rafisarkar0128)",
          inline: true
        },
        {
          name: t("commands:about.fields.repository", { lng }),
          value: "[Here](https://github.com/rafisarkar0128/Node)",
          inline: true
        },
        {
          name: t("commands:about.fields.support", { lng }),
          value: `[Here](${client.config.links.supportServer})`,
          inline: true
        },
        {
          name: "\u200b",
          value: t("commands:about.fields.description", { lng }),
          inline: true
        }
      );

    interaction.editReply({ embeds: [embed], components: [actionRow] });
  }
};
