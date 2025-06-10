/**
 * It was a painful process to make custom logger. So, to simpify the process I am using a package called signale.
 * You can check it here https://www.npmjs.com/package/signale
 * Also the setup is copied from elsewhere.
 */

const { Signale } = require("signale");

/** @@type {SignaleOptions} */
const options = {
  disabled: false,
  interactive: false,
  logLevel: "info",
  scope: "Node",
  config: {
    displayScope: false,
    displayBadge: true,
    displayDate: true,
    displayFilename: false,
    displayLabel: true,
    displayTimestamp: true,
    underlineLabel: false,
    underlineMessage: false,
    underlinePrefix: false,
    underlineSuffix: false,
    uppercaseLabel: false
  },
  types: {
    info: {
      badge: "ℹ",
      color: "blue",
      label: "info"
    },
    warn: {
      badge: "⚠",
      color: "yellow",
      label: "warning"
    },
    error: {
      badge: "✖",
      color: "red",
      label: "error"
    },
    debug: {
      badge: "🐛",
      color: "magenta",
      label: "debug"
    },
    success: {
      badge: "✔",
      color: "green",
      label: "success"
    },
    log: {
      badge: "📝",
      color: "white",
      label: "log"
    },
    pause: {
      badge: "⏸",
      color: "yellow",
      label: "pause"
    },
    start: {
      badge: "▶",
      color: "green",
      label: "start"
    }
  }
};

class Logger extends Signale {
  constructor() {
    super(options);
  }
}

module.exports = { Logger };
