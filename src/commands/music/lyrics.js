const BaseCommand = require("@structures/BaseCommand.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  ComponentType
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
        .setName("lyrics")
        .setDescription(t("commands:lyrics.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "lyrics",
      examples: ["lyrics"],
      category: "music",
      cooldown: 30,
      global: true,
      guildOnly: true,
      player: { voice: true, active: true, playing: true },
      permissions: {
        user: ["SendMessages", "ViewChannel"]
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
    await interaction.deferReply();

    const { guildId, user, channel } = interaction;
    const player = client.lavalink.getPlayer(guildId);
    const track = player.queue.current;
    const trackTitle = track.info.title.replace(/\[.*?\]/g, "").trim();
    const artistName = track.info.author.replace(/\[.*?\]/g, "").trim();

    let lyrics = "";
    let provider = "";
    const lyricsEmbed = new EmbedBuilder()
      .setTitle(`${track.info.title}`)
      .setColor(client.color.Transparent)
      .setURL(track.info.uri);

    const res = await player.getCurrentLyrics(false).catch(() => null);
    if (res && res.lines?.length > 0) {
      res.lines.forEach((l) => (lyrics += `${l.line}\n`));
      provider = res.provider;
    } else {
      const song = (await client.genius.songs.search(trackTitle)).find((s) =>
        s.title.match(trackTitle)
      );
      if (song) {
        lyrics = await song.lyrics(true);
        provider = `Genius Lyrics`;
      }
    }

    if (!lyrics) {
      await interaction.followUp(t("player:noLyrics", { lng }));
      return setTimeout(() => interaction.deleteReply(), 5000);
    }

    const lyricsPages = this.paginateLyrics(lyrics);
    let currentPage = 0;
    lyricsEmbed.setDescription(`**${lyricsPages[currentPage]}**`).setFooter({
      text: `${t("misc:pageInfo", {
        lng,
        index: currentPage + 1,
        total: lyricsPages.length
      })} | ${provider}`
    });

    await interaction.followUp({
      embeds: [lyricsEmbed],
      components: [
        client.utils.buttons.getPage(currentPage, lyricsPages.length)
      ]
    });

    const filter = (interaction) => interaction.user.id === user.id;
    const collector = channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.Button,
      time: 90_000
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "page_first") {
        currentPage = 0;
      } else if (interaction.customId === "page_last") {
        currentPage = lyricsPages.length - 1;
      } else if (interaction.customId === "page_back") {
        currentPage--;
      } else if (interaction.customId === "page_next") {
        currentPage++;
      } else if (interaction.customId === "page_stop") {
        collector.stop();
        return interaction.deferUpdate();
      }

      lyricsEmbed.setDescription(`**${lyricsPages[currentPage]}**`).setFooter({
        text: `${t("misc:pageInfo", {
          lng,
          index: currentPage + 1,
          total: lyricsPages.length
        })} | ${provider}`
      });

      return await interaction.update({
        embeds: [lyricsEmbed],
        components: [
          client.utils.buttons.getPage(currentPage, lyricsPages.length)
        ]
      });
    });

    collector.on("end", () => interaction.deleteReply());
  }

  /**
   * A function to convert lyrics string to pages
   * @param {string} lyrics - the lyrics to convert
   * @returns {string[]}
   */
  paginateLyrics(lyrics) {
    const lines = lyrics.split("\n");
    const pages = [];
    let page = "";

    for (const line of lines) {
      if (page.length + line.length > 1024) {
        pages.push(page);
        page = "";
      }
      page += `${line}\n`;
    }

    if (page) pages.push(page);
    return pages;
  }
};
