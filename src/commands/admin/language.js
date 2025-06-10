const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  PermissionFlagsBits
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
        .setName("language")
        .setDescription(t("commands:language.description"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption((option) =>
          option
            .setName("language")
            .setDescription(t("commands:language.options.language"))
            .setRequired(true)
            .setAutocomplete(true)
        ),
      usage: "language <language>",
      examples: ["language en-US", "language pt-BR"],
      category: "config",
      cooldown: 120,
      global: true,
      guildOnly: true,
      permissions: { user: ["ManageGuild"] }
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
    await interaction.deferReply({ flags: "Ephemeral" });

    const { availableLocales } = client.config;
    const { Languages } = client.resources;
    const locale = interaction.options.getString("language", true);

    if (!availableLocales.includes(locale)) {
      return await interaction.followUp({
        content: t("commands:language.notAvailable", { lng })
      });
    }

    const language = Languages.find((lng) => lng.locale === locale);
    await client.db.guilds.update(interaction.guildId, "locale", locale);
    await interaction.followUp({
      content: t("commands:language.reply", {
        lng: language.locale,
        language: `${language.native} (${language.name})`
      })
    });
  }

  /**
   * Autocomplete function for autocomplete options of this command.
   * @param {import("@structures/BotClient.js")} client
   * @param {import("discord.js").AutocompleteInteraction} interaction
   * @returns {Promise<void>}
   */
  async autocomplete(client, interaction) {
    const { availableLocales } = client.config;
    const { Languages } = client.resources;
    const focused = interaction.options.getFocused().toLowerCase();
    /** @type {import("discord.js").ApplicationCommandChoicesData[]} */
    const languageData = [];

    // If no input was provided
    if (!focused) {
      Languages.filter((lng) => availableLocales.some((l) => l === lng.locale))
        .slice(0, 25)
        .forEach((lng) => {
          languageData.push({
            name: `${lng.name} (${lng.native})`,
            value: lng.locale
          });
        });
    }

    // If some type of input was provided
    else {
      Languages.filter((lng) => {
        return (
          lng.name.toLowerCase().match(focused) ||
          lng.locale.toLowerCase().match(focused) ||
          lng.native.toLowerCase().match(focused)
        );
      })
        .slice(0, 25)
        .forEach((lng) => {
          languageData.push({
            name: `${lng.name} (${lng.native})`,
            value: lng.locale
          });
        });
    }

    return await interaction.respond(languageData);
  }
};
