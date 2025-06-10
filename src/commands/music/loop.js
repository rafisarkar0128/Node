const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
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
        .setName("loop")
        .setDescription(t("commands:loop.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addSubcommand((option) =>
          option
            .setName("off")
            .setDescription(t("commands:loop.subcommand.off"))
        )
        .addSubcommand((option) =>
          option
            .setName("track")
            .setDescription(t("commands:loop.subcommand.track"))
        )
        .addSubcommand((option) =>
          option
            .setName("queue")
            .setDescription(t("commands:loop.subcommand.queue"))
        ),
      usage: "loop <queue|track|off>",
      examples: ["loop off", "loop queue", "loop track"],
      category: "music",
      cooldown: 5,
      global: true,
      guildOnly: true,
      player: { voice: true, active: true, playing: true }
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
    const subcommand = interaction.options.getSubcommand(true);
    const player = client.lavalink.getPlayer(interaction.guildId);
    const embed = new EmbedBuilder().setColor(client.color.Good);
    const message = interaction.channel.messages.cache.get(
      player.get("messageId")
    );

    switch (subcommand) {
      case "off": {
        player.setRepeatMode("off");
        embed.setDescription(t("commands:loop.loopingOff", { lng }));
        break;
      }
      case "track": {
        player.setRepeatMode("track");
        embed.setDescription(t("commands:loop.loopingTrack", { lng }));
        break;
      }
      case "queue": {
        player.setRepeatMode("queue");
        embed.setDescription(t("commands:loop.loopingQueue", { lng }));
        break;
      }
    }

    await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    if (message && message.editable) {
      message.edit({ components: client.utils.buttons.getPlayer(player) });
    }
  }
};
