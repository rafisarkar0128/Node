const BaseEvent = require("@structures/BaseEvent.js");
const chalk = require("chalk");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "disconnect",
      node: true
    });
  }

  /**
   * Execute function for this event
   * @param {import("@structures/BotClient.js")} client
   * @param {import("lavalink-client").LavalinkNode} node
   * @returns {Promise<void>}
   */
  async execute(client, node) {
    client.logger.warn(
      `Lavalink node (${chalk.magenta(node.id)}) disconnected.`
    );
  }
};
