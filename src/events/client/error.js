const BaseEvent = require("@structures/BaseEvent.js");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "error",
      once: false
    });
  }

  /**
   * Execute function for this event
   * @param {Error} error
   * @returns {Promise<void>}
   */
  async execute(client, error) {
    return client.logger.error(error);
  }
};
