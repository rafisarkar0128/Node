const BaseEvent = require("@structures/BaseEvent.js");
const { EmbedBuilder } = require("discord.js");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "guildCreate"
    });
  }

  /**
   * Execute function for this event
   * @param {import("@structures/BotClient.js")} client
   * @param  {import("discord.js").Guild} guild
   * @returns {Promise<void>}
   */
  async execute(client, guild) {
    if (!guild) return;

    const owner = await guild.fetchOwner();
    const embed = new EmbedBuilder()
      .setColor(client.color.Wrong)
      .setAuthor({
        name: guild.name || "Unknown Guild",
        iconURL: guild.iconURL({ extension: "jpeg" })
      })
      .setDescription(`**${guild.name}** has been removed from my guilds!`)
      .setThumbnail(guild.iconURL({ extension: "jpeg" }))
      .addFields(
        {
          name: "Owner",
          value: owner ? owner.user.tag : "Unknown#0000",
          inline: true
        },
        {
          name: "Members",
          value: guild.memberCount?.toString() || "Unknown",
          inline: true
        },
        {
          name: "Created At",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: true
        },
        {
          name: "Removed At",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: true
        },
        { name: "ID", value: guild.id, inline: true }
      )
      .setTimestamp();

    try {
      // const channel = await client.channels.fetch(logChannelId);
      // if (!channel) {
      //   client.logger.error(
      //     `Log channel not found with ID ${logChannelId}. Please change the settings in .env or, if you have a channel, invite me to that guild.`
      //   );
      //   return;
      // }
      await client.utils.logs.send(embed, { type: "general" });
    } catch (error) {
      client.logger.error(`Error sending message to log channel: ${error}`);
    }
  }
};
