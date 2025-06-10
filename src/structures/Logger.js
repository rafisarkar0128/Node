const { DateTime } = require("luxon");
const chalk = require("chalk");
const { basename } = require("path");

const { format } = require("util");
const figures = require("figures").default;
const { grey, magenta } = chalk;

const defaultOptions = {
  scope: "MAIN",
  /**@type {keyof chalk.Chalk} */
  fileColor: "cyanBright",
  config: {
    displayDate: true,
    displayTime: true,
    displayScope: false,
    displayFile: true,
    displayBadge: false,
    displayLabel: true,
    uppercaseLabel: true
  }
};

const types = {
  info: {
    badge: figures.info,
    // badge: "ℹ",
    color: "blue",
    label: "info"
  },
  warn: {
    badge: figures.warning,
    // badge: "⚠",
    color: "yellow",
    label: "warning"
  },
  error: {
    badge: figures.cross,
    // badge: "✖",
    color: "red",
    label: "error"
  },
  debug: {
    badge: figures.circle,
    // badge: "🐛",
    color: "magenta",
    label: "debug"
  },
  success: {
    badge: figures.tick,
    color: "green",
    label: "success"
  },
  log: {
    badge: figures.lozenge,
    color: "white",
    label: "log"
  },
  pause: {
    badge: figures.squareSmallFilled,
    // badge: "⏸",
    color: "yellow",
    label: "pause"
  },
  start: {
    badge: figures.play,
    color: "green",
    label: "start"
  },
  star: {
    badge: figures.star,
    color: "yellow",
    label: "star"
  }
};

// for future updates
const futureTypes = {
  fatal: {
    badge: figures.cross,
    color: "red",
    label: "fatal"
  },
  fav: {
    badge: figures.heart,
    color: "magenta",
    label: "favorite"
  },
  wait: {
    badge: figures.ellipsis,
    color: "blue",
    label: "waiting"
  },
  complete: {
    badge: figures.checkboxOn,
    color: "cyan",
    label: "complete"
  },
  pending: {
    badge: figures.checkboxOff,
    color: "magenta",
    label: "pending"
  },
  note: {
    badge: figures.bullet,
    color: "blue",
    label: "note"
  },
  await: {
    badge: figures.ellipsis,
    color: "blue",
    label: "awaiting"
  },
  watch: {
    badge: figures.ellipsis,
    color: "yellow",
    label: "watching"
  }
};

/**
 * Typings for the log functions of the logger
 * @typedef {Object} LogType
 * @property {string} badge The emoji or the log
 * @property {keyof chalk.Chalk} color The color for the label
 * @property {string} label The label of the log
 */

/**
 * A utility class for managing client console logs.
 * @abstract
 */
module.exports = class Logger {
  /**
   * Typings of options for the logger.
   * @param {typeof defaultOptions} options The options to initialize the logger with
   */
  constructor(options = {}) {
    /**
     * The scope for the logger
     * @private
     * @type {string}
     */
    this._scope = options.scope ?? defaultOptions.scope ?? "";

    /**
     * The color of the filename for the logger
     * @private
     * @type {string}
     */
    this._fileColor = options.fileColor ?? defaultOptions.fileColor;

    /**
     * The config for the logger
     * @private
     * @type {typeof defaultOptions.config}
     */
    this._config = Object.assign(defaultOptions.config, options.config);

    /**
     * The the longest badge of the logger
     * @private
     * @type {string}
     */
    this._longestBadge = this._getLongestBadge();

    /**
     * The the longest label of the logger
     * @private
     * @type {string}
     */
    this._longestLabel = this._getLongestLabel();
  }

  /**
   * Get the longest label from the types.
   * @private
   * @returns {string}
   */
  _getLongestBadge() {
    const badges = Object.keys(types).map((x) => types[x].badge);
    return badges.reduce((x, y) => (x.length > y.length ? x : y));
  }

  /**
   * Get the longest label from the types.
   * @private
   * @returns {string}
   */
  _getLongestLabel() {
    const labels = Object.keys(types).map((x) => types[x].label);
    return labels.reduce((x, y) => (x.length > y.length ? x : y));
  }

  /**
   * A function to pad start of strings with spaces.
   * @private
   * @param {string|any} str
   * @param {number} targetLength
   * @returns {string}
   */
  _padStart(str, targetLength) {
    str = String(str);
    targetLength = parseInt(targetLength, 10) || 0;

    if (str.length >= targetLength) {
      return str;
    }
    if (String.prototype.padStart) {
      return str.padStart(targetLength);
    }

    targetLength -= str.length;
    return " ".repeat(targetLength) + str;
  }

  /**
   * A function to pad end of strings with spaces.
   * @private
   * @param {string|any} str
   * @param {number} targetLength
   * @returns {string}
   */
  _padEnd(str, targetLength) {
    str = String(str);
    targetLength = parseInt(targetLength, 10) || 0;

    if (str.length >= targetLength) {
      return str;
    }
    if (String.prototype.padEnd) {
      return str.padEnd(targetLength);
    }

    targetLength -= str.length;
    return str + " ".repeat(targetLength);
  }

  /**
   * Arrayify a string.
   * @private
   * @param {string|string[]|any} x
   * @returns {string[]}
   */
  _arrayify(x) {
    return Array.isArray(x) ? x : [x];
  }

  /**
   * A function to format anythng to string
   * @private
   * @param {any} str
   * @returns {string}
   */
  _formatMessage(str) {
    return format(...this._arrayify(str));
  }

  /**
   * Get the date of the log message.
   * @private
   * @returns {string}
   */
  get _date() {
    return grey(DateTime.now().toFormat("[dd/MM/yyyy]"));
  }

  /**
   * Get the time of the log message.
   * @private
   * @returns {string}
   */
  get _time() {
    return grey(DateTime.now().toFormat("[h:mm:ss a]"));
  }

  /**
   * Get the scope name for this logger.
   * @private
   * @returns {string}
   */
  get _scopeName() {
    return grey(`[${magenta(this._padEnd(this._scope, 7))}]`);
  }

  /**
   * Get the origin of the log.
   * @private
   * @returns {string}
   */
  get _filename() {
    const _ = Error.prepareStackTrace;
    Error.prepareStackTrace = (error, stack) => stack;
    const { stack } = new Error();
    Error.prepareStackTrace = _;

    const callers = stack.map((x) => x.getFileName());
    const FilePath = callers.find((x) => x !== callers[0]);
    let file = FilePath ? basename(FilePath) : "anonymous";
    file = file.length > 20 ? file.substring(0, 17) + "..." : file;

    return grey(`[${chalk[this._fileColor](this._padEnd(file, 20))}]`);
  }

  /**
   * A function to get meta data of the log
   * @private
   * @returns {string[]}
   */
  _meta() {
    const meta = [];

    if (this._config.displayDate) {
      meta.push(this._date);
    }

    if (this._config.displayTime) {
      meta.push(this._time);
    }

    if (this._config.displayScope) {
      meta.push(this._scopeName);
    }

    if (this._config.displayFile) {
      meta.push(this._filename);
    }

    if (meta.length > 0) {
      meta.push(grey(figures.pointer));
    }

    return meta;
  }

  /**
   * A function to build the log message
   * @private
   * @param {LogType} type
   * @param {...any} args
   * @returns {string}
   */
  _buildLog(type, ...args) {
    const signale = this._meta();
    let msg = "";

    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
      if (args[0] instanceof Error) {
        msg = args[0];
      } else {
        msg = this._formatMessage(args);
      }
    } else {
      msg = this._formatMessage(args);
    }

    if (this._config.displayBadge) {
      signale.push(
        chalk[type.color](
          this._padEnd(type.badge, this._longestBadge.length + 1)
        )
      );
    }

    if (this._config.displayLabel) {
      signale.push(
        chalk[type.color](
          this._padEnd(
            this._config.uppercaseLabel ? type.label.toUpperCase() : type.label,
            this._longestLabel.length + 1
          )
        )
      );
    }

    if (msg instanceof Error && msg.stack) {
      const [name, ...rest] = msg.stack.split("\n");
      signale.push(name);
      signale.push(grey(rest.map((l) => l.replace(/^/, "\n")).join("")));
    } else {
      signale.push(msg);
    }

    return signale.join(" ");
  }

  /**
   * For logging information type messages
   * @param {String} content - can be modified with colors
   * @returns {void}
   */
  info(...content) {
    console.log(this._buildLog(types.info, ...content));
  }

  /**
   * For logging warning type messages
   * @param {string|string[]|any} content - defaults to yellow but can be modified with colors
   * @returns {void}
   */
  warn(...content) {
    console.log(this._buildLog(types.warn, ...content));
  }

  /**
   * For logging error type messages
   * @param {Error|string} content - defaults to red but can be modified with colors
   * @return {void}
   */
  error(...content) {
    console.log(this._buildLog(types.error, ...content));
  }

  /**
   * For logging debug type messages
   * @param {string|string[]|any} content - defaults to green but can be modified with colors
   * @return {void}
   */
  debug(...content) {
    console.log(this._buildLog(types.debug, ...content));
  }

  /**
   * For logging success type messages to test if the code is working as expected
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  success(...content) {
    console.log(this._buildLog(types.success, ...content));
  }

  /**
   * For logging anything
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  log(...content) {
    console.log(this._buildLog(types.log, ...content));
  }

  /**
   * For logging pause type messages
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  pause(...content) {
    console.log(this._buildLog(types.pause, ...content));
  }

  /**
   * For logging start type messages
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  start(...content) {
    console.log(this._buildLog(types.start, ...content));
  }

  /**
   * For logging star (special) type messages
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  star(...content) {
    console.log(this._buildLog(types.star, ...content));
  }
};
