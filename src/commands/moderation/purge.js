const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationIntegrationType,
  InteractionContextType
} = require("discord.js");
const { t } = require("i18next");

/** @type {import("@root/src/types/command").CommandStructure} */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("🧹 Delete bulk amount of messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addSubcommand((option) =>
      option
        .setName("after")
        .setDescription("Delete messages that are after a specific message.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Message ID or Link to delete messages after.")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("any")
        .setDescription("Delete any type of message.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages the bot should delete.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("bots")
        .setDescription("Delete messages sent by bots.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages the bot should delete.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("commands")
        .setDescription("Delete messages which are Slash Commands.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages the bot should delete.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("embeds")
        .setDescription("Delete messages which contain embeds.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages the bot should delete.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("files")
        .setDescription("Delete messages which contain files or attachments.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages the bot should delete.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("user")
        .setDescription("Delete messages sent by a specific user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Select a user whose message to delete.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages the bot should delete.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true)
        )
    ),
  usage: "[subcommand]: <subcommand> [options]: <options>",
  category: "moderation",
  cooldown: 25,
  global: true,
  premium: false,
  devOnly: false,
  disabled: false,
  ephemeral: true,
  voiceChannelOnly: false,
  botPermissions: ["ModerateMembers", "ManageMessages"],
  userPermissions: [
    "ModerateMembers",
    "ManageMessages",
    "ViewChannel",
    "ReadMessageHistory"
  ],
  execute: async (client, interaction, lng) => {
    const { channel, options } = interaction;
    const subcommand = options.getSubcommand(true);
    const count = options.getInteger("count") || 0;
    const messages = await channel.messages.fetch({ limit: 100 });
    const messagesToDelete = [];
    let i = 0;

    switch (subcommand) {
      case "after": {
        const identifier = interaction.options.getString("message");
        const fetchedMessage = messages.get(identifier.split("/").pop());
        if (!fetchedMessage) {
          await interaction.followUp({
            content: t("commands:purge.noMessage", { lng })
          });
          return;
        }
        messages.filter(async (message) => {
          if (message.createdTimestamp <= fetchedMessage.createdTimestamp)
            return;
          messagesToDelete.push(message);
        });
        break;
      }

      case "any": {
        messages.filter(async (message) => {
          if (count <= i) return;
          messagesToDelete.push(message);
          i++;
        });
        break;
      }

      case "bots": {
        messages.filter(async (message) => {
          if (count <= i) return;
          if (message.author.bot) messagesToDelete.push(message);
          i++;
        });
        break;
      }

      case "commands": {
        messages.filter(async (message) => {
          if (count <= i) return;
          if (message.interactionMetadata) messagesToDelete.push(message);
          i++;
        });
        break;
      }

      case "embeds": {
        messages.filter(async (message) => {
          if (count <= i) return;
          if (message.embeds?.length > 0) messagesToDelete.push(message);
          i++;
        });
        break;
      }

      case "files": {
        messages.filter(async (message) => {
          if (count <= i) return;
          if (message.attachments?.size <= 0) return;
          messagesToDelete.push(message);
          i++;
        });
        break;
      }

      case "user": {
        const user = interaction.options.getUser("user", true);
        messages.filter(async (message) => {
          if (count <= i) return;
          if (message.author.id !== user.id) return;
          messagesToDelete.push(message);
          i++;
        });
        break;
      }
    }

    const deletedMessages = await channel.bulkDelete(messagesToDelete, true);
    await interaction.followUp({
      content: t("commands:purge.reply", {
        lng,
        count: `\`${deletedMessages.size}\``,
        channel: `<#${channel.id}>`
      })
    });
  }
};
