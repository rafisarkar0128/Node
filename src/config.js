const pkg = require("@root/package.json");
const { readdirSync, lstatSync } = require("fs");
const { join } = require("path");

module.exports = {
  // default language
  defaultLocale: process.env.DEFAULT_LOCALE ?? "en-US",
  // Available languages for the bot
  availableLocales: readdirSync(join(__dirname, "locales")).filter((file) => {
    const isDirectory = lstatSync(
      join(__dirname, "locales", file)
    ).isDirectory();
    const langFiles = readdirSync(join(__dirname, "locales", file));
    if (isDirectory && langFiles.length > 0) return true;
  }),

  // wether to show table or not.
  showTable: {
    event: false, // event loader table
    command: false // command loader table
  },

  // Bot settings
  bot: {
    // your bots id
    id: process.env.DISCORD_CLIENT_ID,
    // your bots token
    token: process.env.DISCORD_CLIENT_TOKEN,
    // your bots secret
    secret: process.env.DISCORD_CLIENT_SECRET,
    // your discord account id
    ownerId: process.env.OWNER_ID,
    // your guild id
    guildId: process.env.GUILD_ID,
    // default prefix
    prefix: process.env.DEFAULT_PREFIX,
    /**
     * your bots developer ids
     * @type {string[]}
     */
    devs: process.env.DEV_IDS ? JSON.parse(process.env.DEV_IDS) : [],
    // Wheither to make the commands global or not
    global: true,
    // Whether to allow invite command or not
    allowedInvite: true,
    // Default cooldown ammount in secconds
    defaultCooldown: 5,
    // Command syncronization logs
    showSyncLogs: true,
    // default footer for embeds
    footer: `developed by ${pkg.author}`
  },

  // Your genius API credentials. Get it from https://genius.com/developers
  genius: {
    id: process.env.GENIUS_CLIENT_ID,
    secret: process.env.GENIUS_CLIENT_SECRET,
    token: process.env.GENIUS_CLIENT_TOKEN
  },

  // Mongodb URI. Get it from mongodb.com
  mongodbUri: process.env.MONGO_URI,

  /**
   * MongoDB Client options
   * @type {import("mongodb").MongoClientOptions}
   */
  mongodbOptions: {
    dbName: "node",
    timeoutMS: 10000,
    connectTimeoutMS: 30000,
    directConnection: false
  },

  /**
   * Cache settings for various managers
   * @type {Object<string, import("lru-cache").LRUCache>}
   */
  cacheSettings: {
    GuildManager: {
      max: 25000
    },
    UserManager: {
      max: 50000
    }
  },

  // logs ralated config
  logs: {
    general: {
      color: "#36393F",
      channel: process.env.CHANNEL_GENERAL
    },
    error: {
      color: "#de5d5d",
      channel: process.env.CHANNEL_ERROR
    },
    command: {
      color: "#7289DA",
      channel: process.env.CHANNEL_COMMAND
    }
  },

  // Dashboard settings
  dashboard: {
    enabled: true,
    // Base url for the dashboard
    baseUrl: "/",
    // URL to redirect on failure
    failureUrl: "/error",
    // Port for the dashboard
    port: process.env.DASHBOARD_PORT ?? 3000
  },

  // Settings for the music system
  music: {
    enabled: true,
    // Idle time in milliseconds before disconnecting
    idleTime: 180000,
    // Maximum search results to display
    maxSearchResults: 10,
    // Default player volume
    defaultVolume: 25,
    // Default color to use for embeds
    defaultEmbedColor: "#7289DA",
    // maxiimum volume allowed for the player
    maxVolume: 100,
    /**
     * Default source for the music system
     * ! avoid anything ending with "rec". example: "sprec" or "jsrec"
     * @type {import("lavalink-client").SearchPlatform}
     */
    defaultSearchPlatform: "ytmsearch",
    // Lavalink nodes for the music system
    nodes: require("@root/lavalinkNodes.js")
  },

  // Settings for the economy system
  economy: {
    enabled: true,
    // Currency symbol for the economy system
    currency: "💰",
    // Daily coins reward
    dailyCoins: 100,
    // Minimum amount for begging
    minBegAmount: 10,
    // Maximum amount for begging
    maxBegAmount: 250
  },

  // Settings for the giveaway system
  giveaways: {
    enabled: true,
    // Reaction emoji for giveaways
    reaction: "🎁"
  },

  // Settings for the image system
  fun: {
    enabled: true,
    // Base API URL for image commands
    baseApi: "https://strangeapi.fun/api"
  },

  // Settings for the moderation system
  moderation: {
    enabled: true,
    colors: {
      timeout: "#102027", // Color for timeout action
      umtimeout: "#4B636E", // Color for untimeout action
      kick: "#FF7961", // Color for kick action
      softban: "#AF4448", // Color for softban action
      ban: "#D32F2F", // Color for ban action
      unban: "#00C853", // Color for unban action
      vmute: "#102027", // Color for voice mute action
      vunmute: "#4B636E", // Color for voice unmute action
      deafen: "#102027", // Color for deafen action
      undeafen: "#4B636E", // Color for undeafen action
      disconnect: "random", // Color for disconnect action
      move: "#ffcda2" // Color for move action
    }
  },

  // Settings for the rank system
  rank: {
    enabled: true,
    // Cooldown time in seconds for earning XP
    xpCoolDown: 10,
    // Default message for level up
    defaultMessage: "{tag}, You just advanced to **Level {level}**"
  },

  // Settings for the suggestion system
  suggestion: {
    enabled: true,
    downVote: "⬇️",
    upVote: "⬆️"
  },

  // Settings for the ticket system
  ticket: {
    enabled: true
  },

  anime: {
    enabled: true,
    baseApi: "https://api.trace.moe"
  },

  image: {
    enabled: true,
    baseApi: "https://api.trace.moe"
  },

  automod: {
    enabled: true
  },

  social: {
    enabled: true
  },

  // Images to use everywhere
  images: {
    glitch:
      "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_960_720.png"
  },

  // Icons for using everywhere
  icons: {
    youtube: "https://i.imgur.com/xzVHhFY.png",
    spotify: "https://i.imgur.com/qvdqtsc.png",
    soundcloud: "https://i.imgur.com/MVnJ7mj.png",
    applemusic: "https://i.imgur.com/Wi0oyYm.png",
    deezer: "https://i.imgur.com/xyZ43FG.png",
    jiosaavn: "https://i.imgur.com/N9Nt80h.png"
  },

  // Links to use everywhere
  links: {
    botWebsite: process.env.BOT_WEBSITE,
    supportServer: process.env.SUPPORT_SERVER,
    githubRepo: "https://github.com/theassassin0128/Node#readme"
  }
};
