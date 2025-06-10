const BaseEvent = require("@structures/BaseEvent.js");
const { ChannelType, VoiceState } = require("discord.js");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "voiceStateUpdate",
      disabled: true
    });
  }

  /**
   * Execute function for this event
   * @param {import("@structures/BotClient.js")} client
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @returns {Promise<void>}
   */
  async execute(client, oldState, newState) {
    const guildId = newState.guild.id;
    if (!guildId) return;

    const player = client.lavalink.getPlayer(guildId);
    if (!player) return;
    if (!player?.voiceChannelId) return;

    const vc = newState.guild.channels.cache.get(player.voiceChannelId);
    if (!(vc && vc.members instanceof Map)) return;

    // const is247 = await client.db.get_247(guildId);
    // !is247

    if (!newState.guild.members.cache.get(client.user.id)?.voice.channelId) {
      return player.destroy();
    }

    let type;
    // let type = "join" | "leave" | "move" | null;

    // If the stat change is join
    if (!oldState.channelId && newState.channelId) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const bot = newState.guild.voiceStates.cache.get(client.user.id);
      if (!bot) return;

      if (
        bot.id === client.user?.id &&
        bot.channelId &&
        bot.channel?.type === ChannelType.GuildStageVoice &&
        bot.suppress
      ) {
        if (
          bot.channel &&
          bot.member &&
          bot.channel.permissionsFor(bot.member).has("MuteMembers")
        ) {
          await bot.setSuppressed(false);
        }
      }

      const player = client.lavalink.getPlayer(newState.guild.id);
      if (!player) return;

      if (!player?.voiceChannelId) return;

      const vc = newState.guild.channels.cache.get(player.voiceChannelId);
      if (!(vc && vc.members instanceof Map)) return;
      if (newState.id === client.user?.id && !newState.serverDeaf) {
        const permissions = vc.permissionsFor(newState.guild.members.me);
        if (permissions?.has("DeafenMembers")) {
          await newState.setDeaf(true);
        }
      }

      if (newState.id === client.user?.id) {
        if (newState.serverMute && !player.paused) {
          player.pause();
        } else if (!newState.serverMute && player.paused) {
          player.resume();
        }
      }
    }

    // If the stat chnage is leave
    else if (oldState.channelId && !newState.channelId) {
      const player = client.lavalink.getPlayer(newState.guild.id);
      if (!player) return;
      if (!player?.voiceChannelId) return;
      const is247 = await client.db.get_247(newState.guild.id);
      const vc = newState.guild.channels.cache.get(player.voiceChannelId);
      if (!(vc && vc.members instanceof Map)) return;

      if (
        vc.members instanceof Map &&
        [...vc.members.values()].filter((x) => !x.user.bot).length <= 0
      ) {
        setTimeout(async () => {
          if (!player?.voiceChannelId) return;

          const playerVoiceChannel = newState.guild.channels.cache.get(
            player?.voiceChannelId
          );
          if (
            player &&
            playerVoiceChannel &&
            playerVoiceChannel.members instanceof Map &&
            [...playerVoiceChannel.members.values()].filter((x) => !x.user.bot)
              .length <= 0
          ) {
            if (!is247) {
              player.destroy();
            }
          }
        }, 5000);
      }
    }

    //  If the state chnage is move
    else if (
      oldState.channelId &&
      newState.channelId &&
      oldState.channelId !== newState.channelId
    ) {
      // delay for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const bot = newState.guild.voiceStates.cache.get(client.user.id);
      if (!bot) return;

      if (
        bot.id === client.user.id &&
        bot.channelId &&
        bot.channel?.type === ChannelType.GuildStageVoice &&
        bot.suppress
      ) {
        if (
          bot.channel &&
          bot.member &&
          bot.channel.permissionsFor(bot.member).has("MuteMembers")
        ) {
          await bot.setSuppressed(false);
        }
      }
    }
  }
};
