const BaseEvent = require("@structures/BaseEvent.js");
const chalk = require("chalk");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "connect",
      node: true
    });
  }

  /**
   * Execute function for this event
   * @param  {import("lavalink-client").LavalinkNode} node
   * @param {import("@structures/BotClient.js")} client
   * @returns {Promise<void>}
   */
  async execute(client, node) {
    client.logger.success(
      `Lavalink node (${chalk.magenta(node.id)}) connected.`
    );
  }
};
