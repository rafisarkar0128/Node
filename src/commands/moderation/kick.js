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
        .setName("kick")
        .setDescription(t("commands:kick.description"))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription(t("commands:kick.options.target"))
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription(t("commands:kick.options.reason"))
            .setMaxLength(512)
            .setRequired(false)
        ),
      usage: "kick <GuildMember> [reason]",
      examples: [
        "kick target:@node",
        "kick target:67498023237511",
        "kick target:node#5678 reason:For deleting messages."
      ],
      category: "moderation",
      cooldown: 15,
      global: true,
      guildOnly: true,
      permissions: {
        bot: ["KickMembers", "ModerateMembers"],
        user: ["KickMembers", "ModerateMembers"]
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

    let errArray = [];
    let embed = new EmbedBuilder();

    const { member, guild, options } = interaction;
    /** @type {import("discord.js").GuildMember} */
    const target = options.getMember("target", true);
    const reason = options.getString("reason") || "None was provided.";
    const botMember = guild.members.resolve(client.user);

    if (!target) {
      errArray.push(`- ${t("commands:kick.noMember", { lng })}`);
    }

    if (!target.moderatable) {
      errArray.push(`- ${t("commands:kick.notModeratable", { lng })}`);
    }

    if (!target.manageable) {
      errArray.push(`- ${t("commands:kick.notManageable", { lng })}`);
    }

    if (member.roles.highest.position <= target.roles.highest.position) {
      errArray.push(`- ${t("commands:kick.notHighestUserRole", { lng })}`);
    }

    if (botMember.roles.highest.position <= target.roles.highest.position) {
      errArray.push(`- ${t("commands:kick.notHighestBotRole", { lng })}`);
    }

    if (errArray.length > 0) {
      embed
        .setTitle(t("commands:kick.failed", { lng }))
        .setColor(client.color.Wrong)
        .setDescription(errArray.join("\n"));
      return interaction.followUp({ embeds: [embed] });
    }

    await target.kick(reason);
    embed.setDescription(
      t("commands:kick.kicked", { lng, target: target.displayName, reason })
    );
    await interaction.followUp({ embeds: [embed] });
  }
};
