console.clear(); // clearing the console before initializing.
require("dotenv").config(); // Load environment variables from .env file
require("module-alias/register"); // Register module aliases

const { GatewayIntentBits, Partials } = require("discord.js");
const BotClient = require("./structures/BotClient.js");

// Initializing the client with necessary intents and partials
const client = new BotClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember
  ],
  allowedMentions: {
    parse: ["users", "roles", "everyone"],
    repliedUser: false
  },
  failIfNotExists: true
});

// Start the bot and handle any errors
client.start().catch((error) => {
  throw error;
});
