require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const handleMessage = require('./handlers/messageHandler');
const onReady = require('./events/ready');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Evento principal: bot listo
client.once('ready', () => onReady(client));

// Manejador de mensajes
client.on('messageCreate', (message) => handleMessage(message));

// Login con token
client.login(process.env.TOKEN);

// Servidor dummy (solo para mantener Render activo)
const http = require('http');
http.createServer((req, res) => res.end('Bot is running')).listen(process.env.PORT || 3000);
