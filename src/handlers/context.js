const { MessageFlags } = require("discord.js");
const { t } = require("i18next");

/**
 * A function to handle contextmenu commands
 * @param {import("@lib/Bot").Bot} client
 * @param {ContextMenuCommandInteraction} interaction
 * @returns {Promise<void>}
 */
async function handleContext(client, interaction) {
  if (!interaction.inGuild()) {
    return interaction.reply({
      content: t("handlers:context.guildOnly"),
      flags: MessageFlags.Ephemeral
    });
  }

  const { commandName, user, guild } = interaction;
  const { parsePermissions } = client.utils;
  const { devs, defaultCooldown } = client.config.bot;

  const command = client.commands.get(commandName);
  const member = await guild.members.fetch(user.id);
  const bot = await guild.members.fetchMe();
  const lng = (await client.db.guilds.get(guild))?.locale;

  try {
    if (!command) {
      await interaction.reply({
        content: t("handlers:context.notFound", { lng }),
        flags: MessageFlags.Ephemeral
      });

      return client.application.commands.delete(interaction.id);
    }

    if (command.devOnly && !devs.includes(user.id)) {
      return interaction.reply({
        content: t("handlers:context.devOnly", { lng }),
        flags: MessageFlags.Ephemeral
      });
    }

    if (
      command.userPermissions &&
      !member.permissions.has(command.userPermissions)
    ) {
      return interaction.reply({
        content: t("handlers:context.userPermission", {
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
        content: t("handlers:context.botPermission", {
          lng,
          p: parsePermissions(command.botPermissions)
        }),
        flags: MessageFlags.Ephemeral
      });
    }

    if ((command.cooldown ?? defaultCooldown) > 0) {
      const remaining = client.utils.getCooldown(command, user.id);

      if (remaining > 0 && !devs.includes(user.id)) {
        return interaction.reply({
          content: t("handlers:context.cooldown", {
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
      content: t("handlers:context.error", { lng })
    });
    client.logger.error(error);
    client.utils.sendError(error);
  }
}

module.exports = { handleContext };
