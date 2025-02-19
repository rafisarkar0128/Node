const chalk = require("chalk");
const { table } = require("table");
const { t } = require("i18next");

/**
 * A function to log get vanity
 * @param {import("@root/src/lib/DiscordClient").DiscordClient} client - The Discord client
 * @returns {void}
 * @example logVanity(client);
 */
function logVanity(client) {
	// ansi chalk with escape
	let esc = "\u001b[0m";
	let red = "\u001b[31m";
	let blue = "\u001b[36m";
	let green = "\u001b[32m";
	let white = "\u001b[37m";
	let yellow = "\u001b[33m";

	let vanity = [
		"g _   _           _        r____            _           _  b______",
		"g| \\ | | ___   __| | ___  r|  _ \\ _ __ ___ (_) ___  ___| |_b\\ \\ \\ \\",
		"g|  \\| |/ _ \\ / _` |/ _ \\ r| |_) | '__/ _ \\| |/ _ \\/ __| __|b\\ \\ \\ \\",
		"g| |\\  | (_) | (_| |  __/ r|  __/| | | (_) | |  __/ (__| |_  b) ) ) )",
		"g|_| \\_|\\___/ \\__,_|\\___| r|_|   |_|  \\___// |\\___|\\___|\\__|b/ / / /",
		"y=======================================r|__/y==============b/_/_/_/",
	].join("\n");

	vanity = vanity
		.replace(/r/g, red)
		.replace(/g/g, green)
		.replace(/b/g, blue)
		.replace(/y/g, yellow)
		.replace(/w/g, white)
		.replace(/e/g, esc);

	/** @type {import("table").TableUserConfig} */
	const config = {
		columnDefault: {
			alignment: "center",
			width: 62,
		},
		border: client.utils.getTableBorder("green"),
		drawHorizontalLine: (lineIndex, rowCount) => {
			return lineIndex === 0 || lineIndex === rowCount;
		},
	};
	const data = [
		[""],
		[
			t("helpers:vanity.welcome", {
				name: chalk.green("Node Project"),
			}),
		],
		[
			t("helpers:vanity.node", {
				v: chalk.green(process.version),
			}),
		],
		[
			t("helpers:vanity.version", {
				v: chalk.yellow(client.pkg.version),
			}),
		],
		[
			t("helpers:vanity.message", {
				author: chalk.cyan("theassassin0128"),
			}),
		],
		[""],
	];

	console.log(vanity);
	console.log(table(data, config));
}

module.exports = logVanity;
