const { MessageFlags, GuildMember } = require("discord.js");
const { t } = require("i18next");

/**
 * A function to handle player buttons controls
 * @param {import("@lib/Bot").Bot} client
 * @param {ButtonInteraction} interaction
 * @param {Message} message
 * @param {EmbedBuilder} embed
 * @param {import("lavalink-client").Player} player
 * @param {string} lng
 * @returns {void}
 */
function handlePlayerButtons(client, message, embed, player, lng) {
  const { maxVolume } = client.config.music;

  const collector = message.createMessageComponentCollector({
    filter: async (b) => {
      if (b.member instanceof GuildMember) {
        let isSameVoiceChannel =
          b.guild?.members.me?.voice.channelId === b.member.voice.channelId;
        if (isSameVoiceChannel) return true;
      }

      await b.reply({
        content: t("player:notConnected", {
          lng,
          channel: b.guild?.members.me?.voice.channelId ?? "None"
        }),
        flags: MessageFlags.Ephemeral
      });

      return false;
    }
  });

  collector.on("collect", async (interaction) => {
    let user = interaction.user.username;
    await interaction.deferUpdate();

    /**
     * A function to edit the footer of the message
     * @param {string} text
     * @param {boolean} clearButtons
     * @returns {Promise<void>}
     */
    async function editMessage(text, clearButtons) {
      if (!message) return;
      if (clearButtons) {
        await message
          .edit({
            embeds: [
              embed.setFooter({
                text,
                iconURL: interaction.user.avatarURL()
              })
            ],
            components: []
          })
          .catch(console.error);
      } else {
        await message
          .edit({
            embeds: [
              embed.setFooter({
                text,
                iconURL: interaction.user.avatarURL()
              })
            ],
            components: client.utils.getPlayerButtons(player)
          })
          .catch(console.error);
      }
    }

    //if (!(await checkDj(client, interaction))) {
    //  await interaction.followUp({
    //    content: T( "player.trackStart.need_dj_role"),
    //    flags: MessageFlags.Ephemeral
    //  });
    //  return;
    //}

    switch (interaction.customId) {
      case "volumedown": {
        let { volume } = await player.setVolume(
          Math.max(player.volume - 10, 0)
        );
        await editMessage(t("player:volumeBy", { lng, volume, user }));
        break;
      }

      case "volumeup": {
        let { volume } = await player.setVolume(
          Math.min(player.volume + 10, maxVolume)
        );
        await editMessage(t("player:volumeBy", { lng, volume, user }));
        break;
      }

      case "previous": {
        if (!player.queue.previous) {
          await interaction.followUp({
            content: t("player:noPrevious", { lng }),
            flags: MessageFlags.Ephemeral
          });
          break;
        }
        player.play({
          track: player.queue.previous[0]
        });
        // await editMessage(t("player:previousBy", { lng, user }));
        break;
      }

      case "skip": {
        if (!player.queue.tracks.length > 0) {
          await interaction.followUp({
            content: t("player:noTrack", { lng }),
            flags: MessageFlags.Ephemeral
          });
          break;
        }
        player.skip();
        // await editMessage(t("player:skippedBy", { lng, user }));
        break;
      }

      case "resume": {
        if (player.paused) {
          player.resume();
          await editMessage(t("player:resumedBy", { lng, user }));
        } else {
          player.pause();
          await editMessage(t("player:pausedBy", { lng, user }));
        }
        break;
      }

      case "stop": {
        await player.stopPlaying(true, false);
        await interaction.followUp({
          content: t("player:stop", { lng }),
          flags: MessageFlags.Ephemeral
        });
        await editMessage(t("player:stoppedBy", { lng, user }), true);
        break;
      }

      case "shuffle": {
        await player.queue.shuffle();
        await editMessage(t("player:shuffledBy", { lng, user }));
        break;
      }

      case "loop": {
        switch (player.repeatMode) {
          case "off": {
            player.setRepeatMode("queue");
            await editMessage(t("player:loopingQueueBy", { lng, user }));
            break;
          }

          case "queue": {
            player.setRepeatMode("track");
            await editMessage(t("player:loopingTrackBy", { lng, user }));
            break;
          }

          case "track": {
            player.setRepeatMode("off");
            await editMessage(t("player:loopingOffBy", { lng, user }));
            break;
          }
        }
        break;
      }

      case "autoplay": {
        let autoplay = player.get("autoplay");
        if (!autoplay) {
          player.set("autoplay", true);
          await editMessage(t("player:autoplayOnBy", { lng, user }));
        } else {
          player.set("autoplay", false);
          await editMessage(t("player:autoplayOffBy", { lng, user }));
        }
        break;
      }

      case "queue": {
        await interaction.followUp({
          content: "Still in development",
          flags: MessageFlags.Ephemeral
        });
        break;
      }
    }
  });
}

//	case "clear_queue":
//		player.queue.clear();
//		interaction.reply({ content: "Cleared the queue.", ephemeral: true });
//		break;
//	case "vote_skip":
//		const vote = await initiateVoteToSkip(message, player);
//		interaction.reply({ content: `Vote result: ${vote}`, ephemeral: true });
//		break;
//	case "lyrics":
//		const lyrics = await getLyrics(res.tracks[0].title);
//		interaction.reply({
//			content: `Lyrics for **${res.tracks[0].title}**:\n\n${lyrics || "No lyrics found."}`,
//			ephemeral: true,
//		});
//		break;
//	case "seek":
//		player.seek(60000); // Seek to 1 minute
//		interaction.reply({ content: "Seeked to 1 minute.", ephemeral: true });
//		break;
//	case "view_queue":
//		interaction.reply({
//			content: `Current queue:\n${player.queue.map((t, i) => `${i + 1}. ${t.title}`).join("\n")}`,
//			ephemeral: true,
//		});
//		break;
//	case "song-quality":
//		const selectedQuality = interaction.values[0];
//		interaction.reply({
//			content: `Selected song quality: **${selectedQuality}**`,
//			ephemeral: true,
//		});
//		break;
//	case "dj_mode":
//		djModeEnabled = !djModeEnabled;
//		if (!djModeData) {
//			djModeData = new DjMode({ guildId, enabled: djModeEnabled });
//		} else {
//			djModeData.enabled = djModeEnabled;
//		}
//		await djModeData.save();
//		interaction.reply({
//			content: `DJ mode has been ${djModeEnabled ? "enabled" : "disabled"}.`,
//			ephemeral: true,
//		});
//		break;

module.exports = { handlePlayerButtons };
