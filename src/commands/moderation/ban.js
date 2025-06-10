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
        .setName("ban")
        .setDescription(t("commands:ban.description"))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription(t("commands:ban.options.target"))
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription(t("commands:ban.options.reason"))
            .setMaxLength(512)
            .setRequired(false)
        ),
      usage: "ban <GuildMember> [reason]",
      examples: [
        "ban target:@node",
        "ban target:67498023237511",
        "ban target:node#5678 reason:For deleting messages."
      ],
      category: "moderation",
      cooldown: 15,
      global: true,
      guildOnly: true,
      permissions: {
        bot: ["BanMembers", "ModerateMembers", "ManageMessages"],
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

    const { member, guild, options } = interaction;
    const target = options.getMember("target", true);
    const reason = options.getString("reason") || "None was provided.";
    const botMember = guild.members.resolve(client.user);

    let errArray = [];
    let embed = new EmbedBuilder();

    if (!target) {
      errArray.push(`- ${t("commands:ban.noMember", { lng })}`);
    }

    if (!target.moderatable) {
      errArray.push(`- ${t("commands:ban.notModeratable", { lng })}`);
    }

    if (!target.manageable) {
      errArray.push(`- ${t("commands:ban.notManageable", { lng })}`);
    }

    if (member.roles.highest.position <= target.roles.highest.position) {
      errArray.push(`- ${t("commands:ban.notHighestUserRole", { lng })}`);
    }

    if (botMember.roles.highest.position <= target.roles.highest.position) {
      errArray.push(`- ${t("commands:ban.notHighestBotRole", { lng })}`);
    }

    if (errArray.length > 0) {
      embed
        .setTitle(t("commands:ban.failed", { lng }))
        .setColor(client.color.Wrong)
        .setDescription(errArray.join("\n"));
      return interaction.followUp({ embeds: [embed] });
    }

    await target.ban({ reason });
    embed
      .setColor(client.color.Good)
      .setDescription(
        t("commands:ban.banned", { lng, target: target.displayName, reason })
      );
    await interaction.followUp({ embeds: [embed] });
  }
};
