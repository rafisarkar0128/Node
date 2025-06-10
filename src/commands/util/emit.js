const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType
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
        .setName("emit")
        .setDescription(t("commands:emit.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption((option) =>
          option
            .setName("event")
            .setDescription(t("commands:emit.options.event"))
            .setRequired(true)
            .setChoices([
              {
                name: "guildMemeberAdd",
                value: "guildMemberAdd"
              },
              {
                name: "guildMemberRemove",
                value: "guildMemberRemove"
              },
              {
                name: "guildBanAdd",
                value: "guildBanAdd"
              },
              {
                name: "guildBanRemove",
                value: "guildBanRemove"
              },
              {
                name: "guildCreate",
                value: "guildCreate"
              },
              {
                name: "guildDelete",
                value: "guildDelete"
              }
            ])
        )
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription(t("commands:emit.options.member"))
            .setRequired(false)
        ),
      usage: "emit <event>",
      examples: ["emit guildMemberAdd", "emit guildBanAdd"],
      cetagory: "utility",
      cooldown: 0,
      global: true,
      guildOnly: true,
      permissions: { dev: true }
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
    const { options } = interaction;
    const event = options?.getString("event", true);
    const member = options?.getMember("member") ?? interaction.member;

    switch (event) {
      case "guildMemberAdd": {
        client.emit("guildMemberAdd", member);
        break;
      }

      case "guildMemberRemove": {
        client.emit("guildMemberRemove", member);
        break;
      }

      case "guildBanAdd": {
        client.emit("guildBanAdd", member);
        break;
      }

      case "guildBanRemove": {
        client.emit("guildBanRemove", member);
        break;
      }

      case "guildCreate": {
        client.emit("guildCreate", interaction.guild);
        break;
      }

      case "guildDelete": {
        client.emit("guildDelete", interaction.guild);
        break;
      }

      default: {
        return await interaction.reply({
          content: "This event cannot be emited manually at the moment."
        });
      }
    }

    return await interaction.reply({
      content: t("commands:emit.reply", { lng, event }),
      flags: "Ephemeral"
    });
  }
};
