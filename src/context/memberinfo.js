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
  AttachmentBuilder,
  InteractionContextType,
  ApplicationIntegrationType
} = require("discord.js");
const { t } = require("i18next");
const { profileImage } = require("discord-arts");

/** @type {import("@types/index").ContextStructure} */
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Member Information")
    .setType(ApplicationCommandType.User)
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  category: "information",
  cooldown: 120,
  premium: false,
  guildOnly: true,
  devOnly: false,
  global: true,
  disabled: false,
  ephemeral: false,
  botPermissions: ["SendMessages"],
  userPermissions: ["UseApplicationCommands"],

  async execute(client, interaction, lng) {
    const { targetId, guild } = interaction;
    const member = await guild.members.fetch(targetId);
    const topRoles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => r)
      .slice(0, 5);

    const joinedPosition = client.utils.addSuffix(
      Array.from(
        guild.members.cache
          .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
          .keys()
      ).indexOf(member.id) + 1
    );

    const profileBuffer = await profileImage(member.id);
    const banner = new AttachmentBuilder(profileBuffer, {
      name: "banner.png"
    });

    const embed = new EmbedBuilder()
      .setColor(member.roles.color?.hexColor || client.utils.getRandomColor())
      .setThumbnail(member.displayAvatarURL({ size: 4096 }))
      .setImage("attachment://banner.png")
      .setDescription(`<@${member.id}>`)
      .addFields([
        {
          name: t("context:memberinfo.username", { lng }),
          value: `- ${member.user.username}`,
          inline: true
        },
        {
          name: t("context:memberinfo.nickname", { lng }),
          value: `- ${member.displayName}`,
          inline: true
        },
        {
          name: t("context:memberinfo.id", { lng }),
          value: `- ${member.id}`,
          inline: false
        },
        {
          name: t("context:memberinfo.position", { lng }),
          value: `- ${joinedPosition}`,
          inline: false
        },
        {
          name: t("context:memberinfo.roles", {
            lng,
            count: member.roles.cache.size
          }),
          value: `- ${topRoles.join("\n- ")}`,
          inline: false
        },
        {
          name: t("context:memberinfo.boost", { lng }),
          value:
            member.premiumSince ?
              `- Since <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:F>`
            : "- No",
          inline: false
        },
        {
          name: t("context:memberinfo.creation", { lng }),
          value: [
            `- <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`,
            `- <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`
          ].join("\n"),
          inline: false
        },
        {
          name: t("context:memberinfo.join", { lng }),
          value: [
            `- <t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
            `- <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
          ].join("\n"),
          inline: false
        }
      ]);

    await interaction.followUp({ embeds: [embed], files: [banner] });
  }
};
