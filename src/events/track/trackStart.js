const BaseEvent = require("@structures/BaseEvent.js");
const { EmbedBuilder } = require("discord.js");
const { t } = require("i18next");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "trackStart",
      lavalink: true
    });
  }

  /**
   * Execute function for this event
   * @param {import("@structures/BotClient.js")} client
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").Track} track
   * @returns {Promise<void>}
   */
  async execute(client, player, track) {
    if (!track) return;

    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;

    /** @type {import("discord.js").GuildTextBasedChannel} */
    const channel = guild.channels.cache.get(player.textChannelId);
    if (!channel) return;

    const locale = await client.db.guilds.getLocale(guild.id);
    const embed = new EmbedBuilder()
      .setColor(client.lavalink.getColor(track.info.sourceName))
      .setAuthor({
        name: t("player:nowPlaying", { lng: locale }),
        iconURL:
          client.config.icons[track.info.sourceName] ??
          client.user.displayAvatarURL({ extension: "png" })
      })
      .setThumbnail(track.info.artworkUrl)
      .setDescription(
        `**[${client.utils.sliceString(track.info.title, 37)}](${track.info.uri})**`
      )
      .addFields([
        {
          name: t("player:duration", { lng: locale }),
          value:
            track.info.isStream ?
              "`LIVE`"
            : `${client.utils.formatTime(track.info.duration)}`,
          inline: true
        },
        {
          name: t("player:author", { lng: locale }),
          value: `${client.utils.sliceString(track.info.author, 24)}`,
          inline: true
        }
      ]);

    const message = await channel.send({
      embeds: [embed],
      components: [...client.utils.buttons.getPlayer(player)]
    });
    player.set("messageId", message.id);
    return client.handlers.handlePlayerButtons(client, message);
  }
};

//.setImage(track.info.artworkUrl)
// .setFooter({
//   text: t("player:requestedBy", {
//     lng,
//     username: track.requester?.username
//   }),
//   iconURL: track.requester?.avatarURL
// });

// let message = (await channel.messages.fetch()).get(player.get("messageId"));
// if (message) {
//   const buttons = client.utils.buttons.player(player;
//   if (message.embeds[0].footer) embed.setFooter(message.embeds[0].footer);
//   await message.edit({
//     embeds: [embed],
//     components: buttons
//   });
// } else {}
