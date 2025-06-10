const chalk = require("chalk");

/** @type {import("@types/event").EventStructure} */
module.exports = {
  name: "error",
  node: true,
  /**
   * @param {import("lavalink-client").LavalinkNode} node
   */
  async execute(client, node, error) {
    client.logger.error(`The Lavalink Node ${chalk.magenta(node.id)} errored`);
    console.error(error);
  }
};
