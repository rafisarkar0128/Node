const BaseEvent = require("@structures/BaseEvent.js");
const { EmbedBuilder } = require("discord.js");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "guildBanAdd"
    });
  }

  /**
   * Execute function for this event
   * @param {import("@structures/BotClient.js")} client
   * @param  {import("discord.js").GuildBan} ban
   * @returns {Promise<void>}
   */
  async execute(client, ban) {
    if (!ban || ban.user.bot) return;

    const embed = new EmbedBuilder()
      .setTitle("BAN NOTICE")
      .setDescription(
        [
          `<@${ban.user.id}>, you have been banned from **${ban.guild.name}**`,
          `**Reason**: ${ban.reason ?? "None was specified"}.`
        ].join("\n")
      )
      .setColor(client.color.Wrong)
      .setThumbnail(ban.guild.iconURL({ extension: "png", size: 1024 }))
      .setTimestamp();

    await ban.user.send({ embeds: [embed] }).catch(() => null);
  }
};
