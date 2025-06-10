/**
 * @typedef {Object} OldCommand
 * @property {boolean} global
 * @property {import("discord.js").ApplicationCommand} data
 */

/**
 * A function to fetch Application Commands
 * @param {import("@structures/BotClient.js")} client
 * @returns {Promise<OldCommand[]>}
 */
module.exports = async function (client) {
  try {
    if (!client || !client.isReady()) {
      throw new Error("Client is missing or not online.");
    }
    const ApplicationCommands = [];
    const globalCommands = await client.application.commands.fetch({
      withLocalizations: true
    });
    globalCommands.forEach((command) => {
      ApplicationCommands.push({ data: command, global: true });
    });

    const guildCommands = await client.application.commands.fetch({
      guildId: client.config.bot.guildId,
      withLocalizations: true
    });
    guildCommands.forEach((command) => {
      ApplicationCommands.push({ data: command, global: false });
    });
    return ApplicationCommands;
  } catch (error) {
    client.logger.error(error);
  }
};
