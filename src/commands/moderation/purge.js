const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  PermissionFlagsBits
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
        .setName("purge")
        .setDescription(t("commands:purge.description"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addSubcommand((option) =>
          option
            .setName("after")
            .setDescription(t("commands:purge.subcommands.after"))
            .addStringOption((option) =>
              option
                .setName("message")
                .setDescription(t("commands:purge.options.message"))
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("any")
            .setDescription(t("commands:purge.subcommands.any"))
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription(t("commands:purge.options.amount"))
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("bots")
            .setDescription(t("commands:purge.subcommands.bots"))
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription(t("commands:purge.options.amount"))
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("commands")
            .setDescription(t("commands:purge.subcommands.commands"))
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription(t("commands:purge.options.amount"))
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("embeds")
            .setDescription(t("commands:purge.subcommands.embeds"))
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription(t("commands:purge.options.amount"))
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("files")
            .setDescription(t("commands:purge.subcommands.files"))
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription(t("commands:purge.options.amount"))
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("user")
            .setDescription(t("commands:purge.subcommands.user"))
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription(t("commands:purge.options.amount"))
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )
            .addUserOption((option) =>
              option
                .setName("target")
                .setDescription(t("commands:purge.options.target"))
                .setRequired(true)
            )
        ),
      usage: "<subcommand> <options>",
      examples: [
        "purge any amount:20",
        "purge bot amount:24",
        "purge user amount:30 target:@Node"
      ],
      category: "moderation",
      cooldown: 25,
      global: true,
      guildOnly: true,
      permissions: {
        dev: false,
        bot: ["ManageMessages", "ReadMessageHistory"],
        user: ["ManageMessages"]
      }
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
    await interaction.deferReply({ flags: "Ephemeral" });

    const subcommand = interaction.options.getSubcommand(true);
    const amount = interaction.options.getInteger("amount");
    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const messagesToDelete = [];
    let i = 0;

    switch (subcommand) {
      case "after": {
        const identifier = interaction.options.getString("message", true);
        const fetched = messages.get(identifier.split("/").pop());
        if (!fetched) {
          return await interaction.followUp({
            content: t("commands:purge.noMessage", { lng })
          });
        }
        messages.filter(async (m) => {
          if (m.createdTimestamp <= fetched.createdTimestamp) return;
          messagesToDelete.push(m);
        });
        break;
      }

      case "any": {
        messages.filter(async (m) => {
          if (amount <= i) return;
          messagesToDelete.push(m);
          i++;
        });
        break;
      }

      case "bots": {
        messages.filter(async (m) => {
          if (amount <= i) return;
          if (m.author.bot) messagesToDelete.push(m);
          i++;
        });
        break;
      }

      case "commands": {
        messages.filter(async (m) => {
          if (amount <= i) return;
          if (m.interactionMetadata) messagesToDelete.push(m);
          i++;
        });
        break;
      }

      case "embeds": {
        messages.filter(async (m) => {
          if (m.embeds?.length === 0) return;
          if (amount <= i) return;
          messagesToDelete.push(m);
          i++;
        });
        break;
      }

      case "files": {
        messages.filter(async (m) => {
          if (m.attachments?.size === 0) return;
          if (amount <= i) return;
          messagesToDelete.push(m);
          i++;
        });
        break;
      }

      case "user": {
        const user = interaction.options.getUser("target", true);
        messages.filter(async (m) => {
          if (amount <= i) return;
          if (m.author.id !== user.id) return;
          messagesToDelete.push(m);
          i++;
        });
        break;
      }
    }

    const deleted = await interaction.channel.bulkDelete(
      messagesToDelete,
      true
    );
    await interaction.followUp({
      content: t("commands:purge.reply", {
        lng,
        amount: `\`${deleted.size}\``,
        channel: `<#${interaction.channelId}>`
      })
    });
  }
};
