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
        .setName("roles")
        .setDescription(t("commands:roles.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "roles",
      examples: ["roles"],
      category: "information",
      cooldown: 25,
      global: true,
      guildOnly: true
    });
  }

  /**
   * Execute function for this command.
   * @param {import("@structures/BotClient.js")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    const roles = interaction.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => r);
    const embed = new EmbedBuilder().setColor(client.color.getRandom());
    const roleEmbeds = [];

    if (roles.slice(0, 50)?.length) {
      embed.setDescription(`${roles.slice(0, 50).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }

    if (roles.slice(50, 100).length) {
      embed.setDescription(`${roles.slice(50, 100).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }

    if (roles.slice(100, 150).length) {
      embed.setDescription(`${roles.slice(100, 150).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }

    if (roles.slice(150, 200).length) {
      embed.setDescription(`${roles.slice(150, 200).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }

    if (roles.slice(200, 250).length) {
      embed.setDescription(`${roles.slice(200, 250).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }

    await interaction.reply({ embeds: roleEmbeds });
  }
};
