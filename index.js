const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  
  // ID de tu servidor y canal de voz:
  const guild = client.guilds.cache.get('1300545438721507368');
  const channel = guild.channels.cache.get('1300545438721507372');
  
  if (channel) {
    joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false, // Para escuchar, no silenciar el bot
    });
    console.log('🎧 Conectado al canal de voz');
  }
});

client.login(process.env.TOKEN);
