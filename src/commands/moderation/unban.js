const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  PermissionFlagsBits,
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
        .setName("unban")
        .setDescription(t("commands:unban.description"))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription(t("commands:unban.options.target"))
            .setRequired(true)
        ),
      usage: "unban <user>",
      examples: [
        "unban target:@node",
        "unban target:67498023237511",
        "unban target:node#5678"
      ],
      category: "moderation",
      cooldown: 15,
      global: true,
      guildOnly: true,
      permissions: {
        bot: ["BanMembers"],
        user: ["BanMembers", "ModerateMembers"]
      }
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

    const target = interaction.options.getString("target", true);
    const user = await interaction.guild.members.unban(target);
    const embed = new EmbedBuilder().setColor(client.color.Good).setDescription(
      t("commands:unban.unbanned", {
        lng,
        user: `<@${user.id}> (${user.id})`
      })
    );

    await interaction.followUp({ embeds: [embed] });
  }
};
