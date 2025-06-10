const { EmbedBuilder } = require("discord.js");
const { t } = require("i18next");

/** @type {import("@types/index").EventStructure} */
module.exports = {
  name: "trackStart",
  player: true,
  /**
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").Track} track
   */
  async execute(client, player, track) {
    if (!track) return;

    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;

    const lng = (await client.db.guilds.get(guild.id))?.locale;

    /** @type {import("discord.js").GuildTextBasedChannel} */
    const channel = guild.channels.cache.get(player.textChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(client.config.colors.Transparent)
      .setAuthor({
        name: t("player:nowPlaying", { lng }),
        iconURL:
          client.config.icons[track.info.sourceName] ??
          client.user?.displayAvatarURL({ extension: "png" })
      })
      .setDescription(`**[${track.info.title}](${track.info.uri})**`)
      .setThumbnail(track.info.artworkUrl)
      .addFields([
        {
          name: t("player:requestedBy", { lng }),
          value: `<@${track.requester?.id}>`,
          inline: true
        },
        {
          name: t("player:duration", { lng }),
          value: track.info.isStream
            ? "LIVE"
            : client.utils.timeFormat(track.info.duration),
          inline: true
        },
        {
          name: t("player:author", { lng }),
          value: `${track.info.author}`,
          inline: true
        }
      ]);

    // this.client.utils.updateStatus(this.client, guild.id);

    // const setup = await this.client.db.getSetup(guild.id);
    //
    // if (setup?.textId) {
    // 	const textChannel = guild.channels.cache.get(setup.textId)
    // 	if (textChannel) {
    // 		await trackStart(setup.messageId, textChannel, player, track, this.client, locale);
    // 	}
    // } else {
    //	const message = await channel.send({
    //		embeds: [embed],
    //		components: [createButtonRow(player)],
    //	});
    //
    //}

    const message = await channel.send({
      embeds: [embed],
      components: client.utils.getPlayerButtons(player)
    });

    player.set("messageId", message.id);
    client.handlers.handlePlayerButtons(message, embed, player, lng);
  }
};

/*

import { trackStart } from '../../utils/SetupSystem';

/*
		"requested_by": "Requested by {user}",
		"duration": "Duration",
		"author": "Author",
		"need_dj_role": "You need to have the DJ role to use this command.",
		*/

/*
export async function checkDj(
	client: Lavamusic,
	interaction:
		| ButtonInteraction<'cached'>
		| StringSelectMenuInteraction<'cached'>
		| UserSelectMenuInteraction<'cached'>
		| RoleSelectMenuInteraction<'cached'>
		| MentionableSelectMenuInteraction<'cached'>
		| ChannelSelectMenuInteraction<'cached'>,
): Promise<boolean> {
	const dj = await client.db.getDj(interaction.guildId);
	if (dj?.mode) {
		const djRole = await client.db.getRoles(interaction.guildId);
		if (!djRole) return false;
		const hasDjRole = interaction.member.roles.cache.some(role => djRole.map(r => r.roleId).includes(role.id));
		if (!(hasDjRole || interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))) {
			return false;
		}
	}
	return true;
}

*/
