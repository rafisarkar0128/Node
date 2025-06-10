const BaseEvent = require("@structures/BaseEvent.js");
const chalk = require("chalk");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "error",
      node: true
    });
  }

  /**
   * Execute function for this event
   * @param {import("@structures/BotClient.js")} client
   * @param  {import("lavalink-client").LavalinkNode} node
   * @param  {Error} error
   * @returns {Promise<void>}
   */
  async execute(client, node, error) {
    client.logger.error(`Lavalink node (${chalk.magenta(node.id)}) errored:`);
    console.error(error);
    // client.utils.logs.send(error, { type: "error" });
  }
};
