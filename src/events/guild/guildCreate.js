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
    await client.db.guilds.create(guild.id);
    // guild.members.cache.forEach(async (member) => {
    //   await client.db.users.create(member.id);
    // });

    const owner = await guild.fetchOwner();
    const embed = new EmbedBuilder()
      .setColor(client.color.Good)
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ extension: "jpeg" })
      })
      .setDescription(`**${guild.name}** has been added to my guilds!`)
      .setThumbnail(guild.iconURL({ extension: "jpeg" }))
      .addFields(
        {
          name: "Owner",
          value: owner.user.username,
          inline: true
        },
        {
          name: "Members",
          value: guild.memberCount.toString(),
          inline: true
        },
        {
          name: "Created At",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: true
        },
        {
          name: "Joined At",
          value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:F>`,
          inline: true
        },
        { name: "ID", value: guild.id, inline: true }
      )
      .setTimestamp();

    try {
      // const channel = await client.channels.fetch(logChannelId);
      // if (!channel) {
      //   client.logger.error(
      //     `Log channel not found with ID ${logChannelId}. Please change the settings in .env or, if you // have a channel, invite me to that guild.`
      //   );
      //   return;
      // }

      await client.db.guilds.create(guild.id);
      await client.utils.logs.send(embed, { type: "general" });
    } catch (error) {
      client.logger.error(`Error sending message to log channel: ${error}`);
    }
  }
};

// ${logChannelId}
