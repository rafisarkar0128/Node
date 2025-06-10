const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  PermissionFlagsBits,
  EmbedBuilder
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
        .setName("role")
        .setDescription(t("commands:role.description"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addSubcommand((option) =>
          option
            .setName("give")
            .setDescription(t("commands:role.subcommands.give"))
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(t("commands:role.options.role"))
                .setRequired(true)
            )
            .addUserOption((option) =>
              option
                .setName("target")
                .setDescription(t("commands:role.options.target"))
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("remove")
            .setDescription(t("commands:role.subcommands.remove"))
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(t("commands:role.options.role"))
                .setRequired(true)
            )
            .addUserOption((option) =>
              option
                .setName("target")
                .setDescription(t("commands:role.options.target"))
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("multiple")
            .setDescription(t("commands:role.subcommands.multiple"))
            .addStringOption((option) =>
              option
                .setName("action")
                .setDescription(t("commands:role.options.action"))
                .setRequired(true)
                .addChoices([
                  { name: "Give", value: "give" },
                  { name: "Remove", value: "remove" }
                ])
            )
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(t("commands:role.options.role"))
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("targets")
                .setDescription(t("commands:role.options.targets"))
                .setRequired(true)
                .addChoices([
                  { name: "All Members", value: "all" },
                  { name: "Humans", value: "humans" },
                  { name: "Bots", value: "bots" }
                ])
            )
        ),
      usage: "<subcommand> <role> <target>",
      examples: [
        "role give role:@Bots target: @Node",
        "role remove role:@Bots target: @Node"
      ],
      cetagory: "moderation",
      cooldown: 15,
      global: true,
      guildOnly: true,
      permissions: {
        bot: ["ManageRoles"],
        user: ["ManageRoles", "ModerateMembers"]
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

    const embed = new EmbedBuilder().setColor(client.color.Good);
    const { options, guild } = interaction;
    const subcommand = options.getSubcommand(true);
    const role = options.getRole("role", true);
    const target = options.getMember("target");
    const botMember = guild.members.resolve(client.user);

    if (role.position >= botMember.roles.highest.position) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(
          t("commands:role.notManageable", { lng, role: `<@&${role.id}>` })
        );
      return await interaction.followUp({ embeds: [embed] });
    }

    if (
      !interaction.user.id === guild.ownerId &&
      interaction.member.roles.highest.position < role.position
    ) {
      embed
        .setColor(client.color.Wrong)
        .setDescription(
          t("commands:role.notAllowed", { lng, role: `<@&${role.id}>` })
        );
      return await interaction.followUp({ embeds: [embed] });
    }

    switch (subcommand) {
      case "give": {
        await target.roles.add(role);
        embed.setDescription(
          t("commands:role.given", {
            lng,
            role: `<@&${role.id}>`,
            target: `<@${target.id}>`
          })
        );
        await interaction.followUp({ embeds: [embed] });
        break;
      }

      case "remove": {
        await target.roles.remove(role);
        embed.setDescription(
          t("commands:role.removed", {
            lng,
            role: `<@&${role.id}>`,
            target: `<@${target.id}>`
          })
        );
        await interaction.followUp({ embeds: [embed] });
        break;
      }

      case "multiple": {
        const action = options.getString("action", true);
        const targets = options.getString("targets", true);
        /** @type {import("discord.js").GuildMember[]} */
        const memberArray = [];
        for (let [id, member] of guild.members.cache) {
          switch (targets) {
            case "all": {
              return memberArray.push(member);
            }
            case "humans": {
              if (!member.user.bot) memberArray.push(member);
              break;
            }
            case "bots": {
              if (member.user.bot) memberArray.push(member);
              break;
            }
          }
        }

        switch (action) {
          case "give": {
            for (let member of memberArray) {
              await member.roles.add(role);
            }
            embed.setDescription(
              t("commands:role.givenSelected", { lng, role: `<@&${role.id}>` })
            );
            await interaction.followUp({ embeds: [embed] });
            break;
          }

          case "remove": {
            for (let member of memberArray) {
              await member.roles.remove(role);
            }
            embed.setDescription(
              t("commands:role.removedSelected", {
                lng,
                role: `<@&${role.id}>`
              })
            );
            await interaction.followUp({ embeds: [embed] });
            break;
          }
        }
        break;
      }
    }
  }
};
