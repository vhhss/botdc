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

// Dummy HTTP server para Render (no se usa, pero evita warnings)
const http = require('http');
http.createServer((req, res) => res.end('Bot is running')).listen(process.env.PORT || 3000);
