const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  AttachmentBuilder
} = require("discord.js");
const { Profile } = require("discord-arts");
const { t } = require("i18next");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("memberinfo")
        .setDescription(t("commands:memberinfo.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription(t("commands:memberinfo.options.member"))
            .setRequired(true)
        ),
      usage: "memberinfo [member]",
      examples: ["memberinfo"],
      category: "information",
      cooldown: 120,
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
    await interaction.deferReply();

    const { options, guild } = interaction;
    const member = options.getMember("member") ?? interaction.member;
    const profileBuffer = await Profile(member.id);
    const banner = new AttachmentBuilder(profileBuffer, { name: "banner.png" });

    const joinedPosition = client.utils.addSuffix(
      Array.from(
        guild.members.cache
          .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
          .keys()
      ).indexOf(member.id) + 1
    );

    const topRoles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => r)
      .slice(0, 5);

    const MemberInfo = new EmbedBuilder()
      .setColor(member.displayHexColor || client.color.getRandom())
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL()
      })
      .setThumbnail(member.displayAvatarURL({ extension: "png", size: 1024 }))
      .setDescription(
        t("commands:memberinfo.message", {
          lng,
          time: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`,
          user: `<@${member.id}>`,
          position: joinedPosition,
          guild: `**${guild.name}**`
        })
      )
      .setImage("attachment://banner.png")
      .addFields(
        {
          name: t("commands:memberinfo.username", { lng }),
          value: `- ${member.user.username}`,
          inline: true
        },
        {
          name: t("commands:memberinfo.nickname", { lng }),
          value: `- ${member.displayName}`,
          inline: true
        },
        {
          name: t("commands:memberinfo.id", { lng }),
          value: `- ${member.id}`,
          inline: false
        },
        {
          name: t("commands:memberinfo.roles", {
            lng,
            count: member.roles.cache.size
          }),
          value: `- ${topRoles.join("\n- ")}`,
          inline: false
        },
        {
          name: t("commands:memberinfo.boost", { lng }),
          value:
            member.premiumSince ?
              `- Since <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:F>`
            : "- No",
          inline: false
        },
        {
          name: t("commands:memberinfo.creation", { lng }),
          value: [
            // `- <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`,
            `- <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`
          ].join("\n"),
          inline: true
        },
        {
          name: t("commands:memberinfo.join", { lng }),
          value: [
            // `- <t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
            `- <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
          ].join("\n"),
          inline: true
        }
      );

    await interaction.followUp({ embeds: [MemberInfo], files: [banner] });
  }
};
