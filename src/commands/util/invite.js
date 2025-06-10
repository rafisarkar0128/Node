const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} = require("discord.js");
const { t } = require("i18next");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription(t("commmands:invite.description"))
        .setContexts(
          InteractionContextType.Guild,
          InteractionContextType.BotDM,
          InteractionContextType.PrivateChannel
        )
        .setIntegrationTypes(
          ApplicationIntegrationType.GuildInstall,
          ApplicationIntegrationType.UserInstall
        ),
      usage: "invite",
      examples: ["invite"],
      category: "utility",
      cooldown: 5,
      global: true
    });
  }

  /**
   * Execute function for this command.
   * @param {import("@structures/BotClient.js")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {string} lng
   * @returns {Promise<void>}
   */
  async execute(client, interaction, lng) {
    await interaction.deferReply();

    const { bot } = client.config;
    if (!bot.allowedInvite && !bot.devs.includes(interaction.user.id)) {
      return await interaction.reply({
        content: t("commands:invite.disabled", { lng }),
        flags: "Ephemeral"
      });
    }

    const inviteButton = new ButtonBuilder()
      .setLabel("Invite Link")
      .setStyle(ButtonStyle.Link)
      .setURL(this.client.utils.invites.createBot())
      .setEmoji("✉️");

    await interaction.repply({
      content: t("commands:invite.reply", { lng }),
      components: [new ActionRowBuilder().addComponents(inviteButton)]
    });
  }
};
