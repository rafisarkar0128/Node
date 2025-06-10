const {
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Restrict a member's ability to communicate.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Select a member to timeout.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("Timeout duration (e.g., 10m, 1h, 1d, max 28d).")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for timeout.")
        .setMaxLength(512)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (interaction, client) => {
    const { options, member } = interaction;

    const target = options.getMember("target");
    const duration = options.getString("duration");
    const reason = options.getString("reason") || "No reason specified.";

    const errorEmbed = new EmbedBuilder()
      .setTitle("⚠️ Timeout Failed")
      .setColor(client.colors.Error);

    // Basic Checks
    if (!target) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription("Member not found (might have left).")
        ],
        ephemeral: true
      });
    }

    const durationMs = ms(duration);
    if (!durationMs || durationMs > ms("28d")) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "Invalid duration. Must be a valid time under 28 days."
          )
        ],
        ephemeral: true
      });
    }

    if (!target.moderatable) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "I can't timeout this member. Check my role position."
          )
        ],
        ephemeral: true
      });
    }

    if (member.roles.highest.position <= target.roles.highest.position) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "You can't timeout someone with equal or higher role."
          )
        ],
        ephemeral: true
      });
    }

    // Apply timeout
    try {
      await target.timeout(durationMs, reason);
    } catch (err) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            `Failed to timeout member. Error: \`${err.message}\``
          )
        ],
        ephemeral: true
      });
    }

    // Success Embed
    const successEmbed = new EmbedBuilder()
      .setTitle("✅ Timeout Successful")
      .setColor(client.colors.Lime)
      .setDescription(
        `${target} has been timed out for **${ms(durationMs, {
          long: true
        })}**.`
      )
      .addFields({ name: "Reason", value: reason });

    return interaction.reply({ embeds: [successEmbed] });
  }
};
