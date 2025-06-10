const { handleCommands } = require("./commands.js");
const { handleContext } = require("./context.js");
const { handleAutocomplete } = require("./autocomplete.js");
const { handlePlayerButtons } = require("./playerButtons.js");

class Handlers {
  /**
   * Base Client to use in this class
   * @param {import("@lib/Bot").Bot} client
   */
  constructor(client) {
    // Base Client as a property of this class
    this.client = client;
  }

  /**
   * A function to handle slash commands
   * @param {ChatInputCommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async handleCommands(interaction) {
    await handleCommands(this.client, interaction);
  }

  /**
   * A function to handle contextmenu commands
   * @param {ContextMenuCommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async handleContext(interaction) {
    await handleContext(this.client, interaction);
  }

  /**
   * A function to handle AutoComplete Commands
   * @param {AutocompleteInteraction} interaction
   * @returns {Promise<void>}
   */
  async handleAutocomplete(interaction) {
    await handleAutocomplete(this.client, interaction);
  }

  /**
   * A function to handle player buttons controls
   * @param {ButtonInteraction} interaction
   * @param {Message} message
   * @param {EmbedBuilder} embed
   * @param {import("lavalink-client").Player} player
   * @param {string} lng
   * @returns {Promise<void>}
   */
  handlePlayerButtons(message, embed, player, lng) {
    handlePlayerButtons(this.client, message, embed, player, lng);
  }
}

module.exports = { Handlers };
