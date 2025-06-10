const chalk = require("chalk");

/** @type {import("@types/event").EventStructure} */
module.exports = {
  name: "connect",
  node: true,
  /**
   * @param {import("lavalink-client").LavalinkNode} node
   */
  async execute(client, node) {
    client.logger.info(`The Lavalink Node ${chalk.magenta(node.id)} connected`);
  }
};
