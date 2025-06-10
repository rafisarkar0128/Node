const config = require("../config.js");

module.exports = {
  admin: {
    name: "Admin",
    image:
      "https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png",
    emoji: "👨‍⚖️"
  },

  automod: {
    name: "Automod",
    enabled: config.automod.enabled,
    image:
      "https://icons.iconarchive.com/icons/google/noto-emoji-smileys/128/10103-robot-face-icon.png",
    emoji: "🤖"
  },

  anime: {
    name: "Anime",
    enabled: config.anime.enabled,
    image: "https://wallpaperaccess.com/full/5680679.jpg",
    emoji: "🎨"
  },

  config: {
    name: "config",
    image:
      "https://icons.iconarchive.com/icons/froyoshark/enkel/128/Settings-icon.png",
    emoji: "⚙️"
  },

  developer: {
    name: "Developer",
    image:
      "https://www.pinclipart.com/picdir/middle/531-5318253_web-designing-icon-png-clipart.png",
    emoji: "🤴"
  },

  economy: {
    name: "Economy",
    enabled: config.economy.enabled,
    image:
      "https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/128/coins-icon.png",
    emoji: "🪙"
  },

  fun: {
    name: "Fun",
    enabled: config.fun.enabled,
    image:
      "https://icons.iconarchive.com/icons/flameia/aqua-smiles/128/make-fun-icon.png",
    emoji: "😂"
  },
  general: {
    name: "General",
    image: "",
    emoji: "🏘️"
  },

  giveaways: {
    name: "Giveaway",
    enabled: config.giveaways.enabled,
    image: "https://cdn-icons-png.flaticon.com/512/4470/4470928.png",
    emoji: "🎉"
  },

  image: {
    name: "Image",
    enabled: config.image.enabled,
    image:
      "https://icons.iconarchive.com/icons/dapino/summer-holiday/128/photo-icon.png",
    emoji: "🖼️"
  },

  information: {
    name: "Information",
    image:
      "https://icons.iconarchive.com/icons/graphicloads/100-flat/128/information-icon.png",
    emoji: "🪧"
  },

  moderation: {
    name: "Moderation",
    enabled: config.moderation.enabled,
    image:
      "https://icons.iconarchive.com/icons/lawyerwordpress/law/128/Gavel-Law-icon.png",
    emoji: "🔨"
  },

  music: {
    name: "Music",
    enabled: config.music.enabled,
    image:
      "https://icons.iconarchive.com/icons/wwalczyszyn/iwindows/256/Music-Library-icon.png",
    emoji: "🎵"
  },

  rank: {
    name: "Ranking",
    enabled: config.rank.enabled,
    image:
      "https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/dollar-stats-icon.png",
    emoji: "📈"
  },

  social: {
    name: "Social",
    enabled: config.social.enabled,
    image:
      "https://icons.iconarchive.com/icons/dryicons/aesthetica-2/128/community-users-icon.png",
    emoji: "🫂"
  },

  suggestion: {
    name: "Suggestion",
    enabled: config.suggestion.enabled,
    image: "https://cdn-icons-png.flaticon.com/512/1484/1484815.png",
    emoji: "📝"
  },

  ticket: {
    name: "Ticket",
    enabled: config.ticket.enabled,
    image:
      "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/512/ticket-icon.png",
    emoji: "🎫"
  },

  utility: {
    name: "Utility",
    image:
      "https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/128/Utilities-icon.png",
    emoji: "🛠"
  }
};
