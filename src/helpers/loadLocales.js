const { readdirSync, lstatSync } = require("fs");
const { join } = require("path");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");

/**
 * A function to load languages
 * @param {import("@structures/BotClient.js")} client
 * @returns {Promise<void>}
 * @example
 * await client.helpers.loadLanguages(client);
 */
module.exports = async function (client) {
  // initializing i18next with i18next-fs-backend
  await i18next.use(Backend).init({
    initAsync: false,
    load: "currentOnly",
    ns: ["commands", "context", "embeds", "misc", "handlers", "player"],
    defaultNS: false,
    fallbackNS: false,
    fallbackLng: ["en-US"],
    lng: client.config.defaultLocale ?? "en-US",
    interpolation: { escapeValue: false },
    preload: readdirSync(join(__dirname, "../locales")).filter((file) => {
      const isDirectory = lstatSync(
        join(__dirname, "../locales", file)
      ).isDirectory();
      const langFiles = readdirSync(join(__dirname, "../locales", file));
      if (isDirectory && langFiles.length > 0) return true;
    }),
    backend: {
      loadPath: join(__dirname, "../locales/{{lng}}/{{ns}}.json"),
      addPath: join(__dirname, "../locales/{{lng}}/{{ns}}.missing.json")
    }
  });

  client.logger.info("Loaded languages successfully.");
};
