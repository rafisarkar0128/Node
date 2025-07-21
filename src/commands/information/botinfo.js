const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  version,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} = require("discord.js");
const { t } = require("i18next");
const os = require("os");
const { showTotalMemory, usagePercent } = require("node-system-stats");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription(t("commands:botinfo.description"))
        .setContexts(
          InteractionContextType.BotDM,
          InteractionContextType.Guild,
          InteractionContextType.PrivateChannel
        )
        .setIntegrationTypes(
          ApplicationIntegrationType.GuildInstall,
          ApplicationIntegrationType.UserInstall
        ),
      usage: "botinfo",
      examples: ["botinfo"],
      cetagory: "information",
      cooldown: 30,
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
    const reply = await interaction.deferReply({ withResponse: true });

    const osInfo = `${os.type()} ${os.release()}`;
    const osUptime = client.utils.formatTime(os.uptime());
    const osHostname = os.hostname();
    const cpuInfo = `${os.arch()} (${os.cpus().length} cores)`;
    const cpuUsed = (await usagePercent({ coreIndex: 0, sampleMs: 2000 }))
      .percent;
    const memTotal = showTotalMemory(true);
    const memUsed = (process.memoryUsage().rss / 1024 ** 2).toFixed(2);
    const nodeVersion = process.version;
    const discordJsVersion = version;
    const commands = client.commands.size;

    const gateway = client.ws.ping;
    const response =
      reply.resource.message.createdTimestamp - interaction.createdTimestamp;

    const results = await Promise.all([
      client.shard?.broadcastEval((client) => client.guilds.cache.size),
      client.shard?.broadcastEval((client) =>
        client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      ),
      client.shard?.broadcastEval((client) => client.channels.cache.size)
    ]);

    const guilds =
      results[0]?.reduce((acc, guildCount) => acc + guildCount, 0) ??
      client.guilds.cache.size;

    const users =
      results[1]?.reduce((acc, memberCount) => acc + memberCount, 0) ??
      client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    const channels =
      results[2]?.reduce((acc, channelCount) => acc + channelCount, 0) ??
      client.guilds.cache.reduce(
        (acc, guild) => acc + guild.channels.cache.size,
        0
      );

    const botInfo = t("commands:botinfo.content", {
      lng,
      osInfo,
      osUptime,
      osHostname,
      cpuInfo,
      cpuUsed,
      memUsed,
      memTotal,
      nodeVersion,
      discordJsVersion,
      guilds,
      channels,
      users,
      commands
    });

    const embed = new EmbedBuilder()
      .setColor(client.color.Transparent)
      .setDescription(botInfo);

    const actionRow = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel(t("misc:buttons.support", { lng }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.supportServer),
      new ButtonBuilder()
        .setLabel(t("misc:buttons.website", { lng }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.botWebsite),
      new ButtonBuilder()
        .setLabel(t("misc:buttons.invite", { lng }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.utils.invites.getBot())
    );

    await interaction.followUp({ embeds: [embed], components: [actionRow] });
  }
};

// const cpu = (process.cpuUsage().system / 1024 / 1024).toFixed(2);
// const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

//.addFields([
//  {
//    name: "User Informaton",
//    value: [
//      `- Name: ${client.user.username}`,
//      `- Tag: ${client.user.tag}`,
//      `- ID: \`${client.user.id}\``
//    ].join("\n")
//  },
//  {
//    name: "Bot Stats",
//    value: [
//      `- Gateway Ping: \`${gateway}ms\``,
//      `- Response Time: \`${response}ms\``,
//      `- Uptime: \`${client.utils.formatTime(client.uptime)}\``,
//      `- Version: \`${client.pkg.version}\``,
//      `- Owner: <@${client.config.bot.ownerId}>`,
//      `- Commands: \`${client.commands.filter((c) => c.global).size} (global)\``
//    ].join("\n")
//  },
//  {
//    name: "System Information",
//    value: [
//      `- Host: [nodejs](https://nodejs.org/en) \`(${process.version})\` | [discord.js](https:////discord.js.org/#/) \`(${version})\``,
//      `- Stats: CPU : \`${cpuUsed}%\` | RAM : \`${memUsed} MB\``
//    ].join("\n")
//  }
//]);
