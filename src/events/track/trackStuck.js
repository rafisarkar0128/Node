const BaseEvent = require("@structures/BaseEvent.js");
const { EmbedBuilder } = require("discord.js");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "trackStuck",
      lavalink: true
    });
  }

  /**
   * Execute function for this event
   * @param {import("@structures/BotClient.js")} client
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").Track} track
   * @param {import("lavalink-client").TrackStuckEvent} payload
   * @returns {Promise<void>}
   */
  async execute(client, player, track, payload) {
    client.logger.error(
      `Track: ${track.info.title} got stuck in guild: ${payload.guildId}`
    );

    const errorEmbed = new EmbedBuilder()
      .setColor(client.color.Wrong)
      .setTitle("Playback error!")
      .setDescription(`Failed to load track: \`${track.info.title}\``)
      .setFooter({
        text: "Oops! something went wrong but it's not your fault!"
      });

    /** @type {import("discord.js").TextBasedChannel} */
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;

    await channel.send({ embeds: [errorEmbed] });

    const message = await channel.messages.fetch(player.get("messageId"));
    if (!message || !message.editable) return;

    await message.edit({ components: [] }).catch(() => null);
  }
};
