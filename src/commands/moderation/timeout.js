const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");
const { t } = require("i18next");
const ms = require("ms");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription(t("commands:timeout.description"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription(t("commands:timeout.options.target"))
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription(t("commands:timeout.options.target"))
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription(t("commands:timeout.options.target"))
            .setRequired(false)
        ),
      usage: "timeout <target> <duration> [reason]",
      examples: [
        "timeout target:@node duration:20min reason:For No Reason",
        "timeout target:@example 3d"
      ],
      category: "moderation",
      cooldown: 15,
      global: true,
      guildOnly: true,
      permissions: {
        bot: ["ModerateMembers"],
        user: ["ModerateMembers"]
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

    const { options, guild, member } = interaction;
    const target = options.getMember("target", true);
    const duration = options.getString("duration", true);
    const reason = options.getString("reason") ?? "No reason specified.";
    const botMember = guild.members.resolve(client.user);

    const errArray = [];
    const errEmbed = new EmbedBuilder()
      .setColor(client.color.Wrong)
      .setTitle(t("commands:timeout.failed", { lng }));

    if (!target) {
      errEmbed.setDescription(t("commands:timeout.noMember", { lng }));
      return await interaction.followUp({ embeds: [errEmbed] });
    }

    if (!ms(duration) || ms(duration) > ms("28d"))
      errArray.push(`- ${t("commands:timeout.invalidTime", { lng })}`);

    if (!target.moderatable || !target.manageable)
      errArray.push(`- ${t("commands:timeout.notModeratable", { lng })}`);

    if (member.roles.highest.position < target.roles.highest.position) {
      errArray.push(`- ${t("commands:timeout.notHighestUserRole", { lng })}`);
    }

    if (botMember.roles.highest.position <= target.roles.highest.position) {
      errArray.push(`- ${t("commands:timeout.notHighestBotRole", { lng })}`);
    }

    if (errArray.length > 0) {
      errEmbed.setDescription(errArray.join("\n"));
      return await interaction.followUp({ embeds: [errEmbed] });
    }

    try {
      await target.timeout(ms(duration), reason);
    } catch (error) {
      errEmbed.setDescription(
        t("commands:timeout.error", { lng, error: error.message })
      );
      await interaction.followUp({ embeds: [errEmbed] });
      throw error;
    }

    // const newInfractionObject = {
    //   Issuer: member.id,
    //   IssuerTag: user.tag,
    //   Reason: reason,
    //   Date: Date.now
    // };

    // let userData = await infractions.findOne({
    //   Guild: guild.id,
    //   User: target.id
    // });

    // if (!userData) {
    //   userData = await infractions.create({
    //     Guild: guild.id,
    //     User: target.id,
    //     Infractions: [newInfractionObject]
    //   });
    // } else {
    //   userData.Infractions.push(newInfractionObject) && (await userData.save());
    // }

    // userData.Infractions.length

    const sEmbed = new EmbedBuilder()
      .setAuthor({ name: "Timeout Issues", iconURL: guild.iconURL() })
      .setColor(client.color.Good)
      .setDescription(
        t("commands:timeout.timeout", {
          lng,
          target: `${target}`,
          duration: ms(ms(duration), { long: true }),
          member: `${member}`,
          infractions: 0,
          reason
        })
      );

    await interaction.followUp({ embeds: [sEmbed] });
  }
};
