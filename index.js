require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const handleMessage = require('./handlers/messageHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', (message) => handleMessage(message));

client.login(process.env.TOKEN);
