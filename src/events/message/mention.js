const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require("discord.js");
const { t } = require("i18next");

/** @type {import("@types/index").EventStructure} */
module.exports = {
  name: "messageCreate",
  /**
   * Typing for execution function
   * @param {Message} message
   */
  async execute(client, message) {
    if (message.author.bot) return;

    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (!message.content.match(prefixMention)) return;

    const lng = (await client.db.guilds.get(message.guild.id))?.locale;
    const embed = new EmbedBuilder()
      .setTitle(t("embeds:mention.title", { lng }))
      .setDescription(
        t("embeds:mention.description", {
          lng,
          user: `**<@${client.user.id}>**`,
          owner: `**<@${client.config.bot.ownerId}>**`
        })
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.utils.getRandomColor())
      .setFooter({
        text: t("embeds:default.footer", {
          lng,
          username: client.user.username,
          year: new Date().getFullYear()
        })
      });

    const githubButton = new ButtonBuilder()
      .setLabel("GitHub")
      .setStyle(ButtonStyle.Link)
      .setURL(client.config.links.githubRepo);

    const discordButton = new ButtonBuilder()
      .setLabel("Support")
      .setStyle(ButtonStyle.Link)
      .setURL(client.config.links.supportServer);

    const inviteButton = new ButtonBuilder()
      .setLabel("Invite Me")
      .setStyle(ButtonStyle.Link)
      .setURL(await client.utils.getInvite());

    const websiteButton = new ButtonBuilder()
      .setLabel("Website")
      .setStyle(ButtonStyle.Link)
      .setURL(client.config.links.botWebsite);

    const actionRow = new ActionRowBuilder()
      .addComponents(websiteButton)
      .addComponents(inviteButton)
      .addComponents(discordButton)
      .addComponents(githubButton);

    return message.reply({
      embeds: [embed],
      components: [actionRow]
    });
  }
};
