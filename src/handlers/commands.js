const { MessageFlags } = require("discord.js");
const { t } = require("i18next");

/**
 * A function to handle slash commands
 * @param {import("@lib/Bot").Bot} client
 * @param {ChatInputCommandInteraction} interaction
 * @returns {Promise<void>}
 */
async function handleCommands(client, interaction) {
  if (!interaction.inGuild()) {
    return interaction.reply({
      content: t("handlers:commands.guildOnly"),
      flags: MessageFlags.Ephemeral
    });
  }

  const { commandName, user, member, guild } = interaction;
  const { parsePermissions } = client.utils;
  const { devs, defaultCooldown } = client.config.bot;

  const command = client.commands.get(commandName);
  const bot = await guild.members.fetchMe();
  const lng = (await client.db.guilds.get(guild.id))?.locale;

  try {
    if (!command) {
      await interaction.reply({
        content: t("handlers:commands.notFound", { lng }),
        flags: MessageFlags.Ephemeral
      });

      return client.application.commands.delete(interaction.id);
    }

    if (command.devOnly && !devs.includes(user.id)) {
      return interaction.reply({
        content: t("handlers:commands.devOnly", { lng }),
        flags: MessageFlags.Ephemeral
      });
    }

    if (
      command.userPermissions &&
      !member.permissions.has(command.userPermissions)
    ) {
      return interaction.reply({
        content: t("handlers:commands.userPermission", {
          lng,
          p: parsePermissions(command.userPermissions)
        }),
        flags: MessageFlags.Ephemeral
      });
    }

    if (
      command.botPermissions &&
      !bot.permissions.has(command.botPermissions)
    ) {
      return interaction.reply({
        content: t("handlers:commands.botPermission", {
          lng,
          p: parsePermissions(command.botPermissions)
        }),
        flags: MessageFlags.Ephemeral
      });
    }

    if (command.voiceChannelOnly) {
      /** @type {import("discord.js").VoiceChannel} */
      const voicechannel = member.voice?.channel;

      if (!voicechannel) {
        return interaction.reply({
          content: t("handlers:commands.voiceChannelOnly", { lng }),
          flags: MessageFlags.Ephemeral
        });
      }

      if (!voicechannel.joinable || !voicechannel.speakable) {
        return interaction.reply({
          content: t("handlers:commands.missingVCPermission", { lng }),
          flags: MessageFlags.Ephemeral
        });
      }
    }

    if ((command.cooldown ?? defaultCooldown) > 0) {
      const remaining = client.utils.getCooldown(command, user.id);

      if (remaining > 0 && !devs.includes(user.id)) {
        return interaction.reply({
          content: t("handlers:commands.cooldown", {
            lng,
            t: `<t:${remaining}:R>`
          }),
          flags: MessageFlags.Ephemeral
        });
      }
    }

    await interaction.deferReply({
      flags: command.ephemeral ? MessageFlags.Ephemeral : undefined
    });

    await command.execute(client, interaction, lng);
  } catch (error) {
    await interaction.followUp({
      content: t("handlers:commands.error", { lng })
    });
    client.logger.error(error);
    client.utils.sendError(error);
  }
}

module.exports = { handleCommands };
