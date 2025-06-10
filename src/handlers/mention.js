const { EmbedBuilder } = require("discord.js");
const { t } = require("i18next");

/**
 * A function to handle bot mentions in messages
 * @param {import("@structures/BotClient")} client
 * @param {import("discord.js").Message} message
 */
async function handleMention(client, message) {
  let settings = await client.db.guilds.get(message.guildId);
  if (!settings) {
    settings.locale = client.config.defaultLocale;
    settings.prefix = client.config.bot.prefix;
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.avatarURL({ extension: "png" })
    })
    .setThumbnail(client.user.avatarURL({ extension: "png" }))
    .setColor(client.color.getRandom())
    .setDescription(
      t("handlers:prefixMention", {
        lng: settings.locale,
        prefix: settings.prefix
      })
    )
    .setFields([]);

  return await message.reply({ embeds: [embed] });
}

module.exports = handleMention;
