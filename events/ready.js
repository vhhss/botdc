const { joinVoiceChannel } = require('@discordjs/voice');
const keepAlive = require('../utils/voiceLoop');
const { guildId, channelId } = require('../config/config');

module.exports = async (client) => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);

    if (channel && channel.isVoiceBased()) {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
      });

      console.log('🎧 Conectado al canal de voz, esperando 1s para iniciar audio...');
        setTimeout(() => {
        keepAlive(connection);
        }, 1000);
    } else {
      console.log('❌ No se encontró el canal o no es de voz');
    }
  } catch (err) {
    console.error('💥 Error al conectar al canal:', err);
  }
};
