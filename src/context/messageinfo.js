const BaseCommand = require("@structures/BaseCommand.js");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor(client) {
    super(client, {
      name: "",
      description: "",
      aliases: [],
      options: [
        {
          name: "",
          description: "",
          type: "",
          required: ""
        }
      ],
      contexts: ["BotDM", "Guild", "PrivateChannel"],
      integrationTypes: ["GuildInstall", "UserInstall"],
      cetagory: "general",
      cooldown: 5,
      global: true,
      ephemeral: false,
      disabled: false,
      player: {
        voice: false,
        dj: false,
        active: false,
        djPerm: null
      },
      permissions: {
        dev: true,
        bot: [],
        user: []
      },
      args: false,
      slashCommand: true
    });
  }

  /**
   * Execute function for this command.
   * @param {import("@root/collected/Context")} ctx
   * @returns {Promise<void>}
   */
  async execute(client, ctx) {
    let msg = await ctx.reply("This command is in development.");
    setTimeout(() => {
      msg.delete();
    }, 9000);
  }

  /**
   * Autocomplete function for autocomplete options of this command.
   * @param {import("discord.js").AutocompleteInteraction} interaction
   * @returns {Promise<void>}
   */
  async autocomplete(client, interaction) {}
};

const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType
} = require("discord.js");
const { t } = require("i18next");

/** @type {import("@types/index").ContextStructure} */
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Message Information")
    .setType(ApplicationCommandType.Message)
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  category: "information",
  cooldown: 30,
  premium: false,
  guildOnly: true,
  devOnly: false,
  global: true,
  disabled: false,
  ephemeral: false,
  botPermissions: ["SendMessages"],
  userPermissions: ["UseApplicationCommands"],
  execute: async (client, interaction, lng) => {
    const { targetId, channel } = interaction;
    const message = await channel.messages.fetch(targetId);

    const embed = new EmbedBuilder()
      .setThumbnail(message.author.displayAvatarURL({ size: 4096 }))
      .setDescription(
        `[${t("context:messageinfo.click", { lng })}](${message.url})`
      )
      .addFields([
        {
          name: t("context:messageinfo.author", { lng }),
          value: `<@${message.author.id}>`,
          inline: true
        },
        {
          name: t("context:messageinfo.id"),
          value: `- ${message.id}`,
          inline: true
        },
        {
          name: t("context:messageinfo.creation", { lng }),
          value: [
            `- <t:${Math.floor(message.createdTimestamp / 1000)}:F>`,
            `- <t:${Math.floor(message.createdTimestamp / 1000)}:R>`
          ].join("\n"),
          inline: false
        },
        {
          name: t("context:messageinfo.edit", { lng }),
          value:
            message.editedTimestamp ?
              [
                `- <t:${Math.floor(message.editedTimestamp / 1000)}:F>`,
                `- <t:${Math.floor(message.editedTimestamp / 1000)}:R>`
              ].join("\n")
            : `- ${t("context:messageinfo.edited", { lng })}`,
          inline: false
        }
      ])
      .setColor(client.utils.getRandomColor());

    await interaction.followUp({
      embeds: [embed]
    });
  }
};
