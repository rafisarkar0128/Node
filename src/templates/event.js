const BaseEvent = require("@structures/BaseEvent.js");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "",
      once: false,
      rest: false,
      ws: false,
      node: false,
      lavalink: false,
      disabled: false
    });
  }

  /**
   * Execute function for this event
   * @param {import("@structures/BotClient.js")} client
   * @returns {Promise<void>}
   */
  async execute(client) {
    return client.logger.info(`${this.name} works fine!`);
  }
};
