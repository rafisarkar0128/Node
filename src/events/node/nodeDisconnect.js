const chalk = require("chalk");

/** @type {import("@types/event").EventStructure} */
module.exports = {
  name: "disconnect",
  node: true,
  /**
   * @param {import("lavalink-client").LavalinkNode} node
   */
  async execute(client, node) {
    client.logger.warn(
      `The Lavalink Node ${chalk.magenta(node.id)} disconnected`
    );
  }
};
