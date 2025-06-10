const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  ChannelType
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
        .setName("serverinfo")
        .setDescription(t("commands:serverinfo.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "serverinfo",
      examples: ["serverinfo"],
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
   * @param {string} lng
   * @returns {Promise<void>}
   */
  async execute(client, interaction, lng) {
    await interaction.deferReply();

    const guild = await interaction.guild.fetch();
    const members = await guild.members.fetch();
    const channels = guild.channels.cache;
    const emojis = guild.emojis.cache;
    const stickers = guild.stickers.cache;

    const embed = new EmbedBuilder()
      .setColor(client.color.getRandom())
      .setThumbnail(guild.iconURL({ size: 1024, extension: "png" }))
      .setImage(guild.bannerURL())
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ extension: "png" })
      })
      .setDescription(guild.description)
      .addFields([
        {
          name: t("commands:serverinfo.id", { lng }),
          value: `- ${guild.id}`,
          inline: false
        },
        {
          name: t("commands:serverinfo.ownedBy", { lng }),
          value: `- <@${guild.ownerId}>`,
          inline: false
        },
        {
          name: t("commands:serverinfo.boost", { lng }),
          value: [
            `- **${guild.premiumSubscriptionCount}** Boosts`,
            `( Level: **${guild.premiumTier}** )`
          ].join(" "),
          inline: false
        },
        {
          name: t("commands:serverinfo.members", { lng, size: members.size }),
          value: [
            "-",
            `**${members.filter((m) => !m.user.bot).size}** Humans`,
            "|",
            `**${members.filter((m) => m.user.bot).size}** Bots`
          ].join(" "),
          inline: true
        },
        {
          name: t("commands:serverinfo.expressions", {
            lng,
            size: emojis.size + stickers.size
          }),
          value: [
            `- **${emojis.filter((e) => e.animated === false).size}** Normal`,
            `| **${emojis.filter((e) => e.animated === true).size}** Animated`,
            `| **${stickers.size}** Sticker`
          ].join(" "),
          inline: false
        },
        {
          name: t("commands:serverinfo.channels", { lng, size: channels.size }),
          value: [
            `- **${
              channels.filter((c) => c.type === ChannelType.GuildText).size
            }** Text | **${
              channels.filter((c) => c.type === ChannelType.GuildVoice).size
            }** Voice`,
            `- ${t("commands:serverinfo.channelView", { lng })}`
          ].join("\n"),
          inline: false
        },
        {
          name: t("commands:serverinfo.roles", {
            lng,
            size: guild.roles.cache.size
          }),
          value: `- ${t("commands:serverinfo.roleView", { lng })}`,
          inline: false
        },
        {
          name: t("commands:serverinfo.createdOn", { lng }),
          value: [
            `- <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
            `- <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`
          ].join("\n"),
          inline: true
        }
      ]);

    await interaction.followUp({ embeds: [embed] });
  }
};
