const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require('@discordjs/voice');
const keepAlive = require('../utils/voiceLoop');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'testsound',
  description: 'Reproduce un sonido corto (máx. 3 segundos) y vuelve al loop de silencio.',
  async execute(message) {
    const userChannel = message.member?.voice?.channel;
    if (!userChannel) {
      return message.reply('❌ Tenés que estar en un canal de voz primero, gatin.');
    }

    // 🎧 Conectamos al canal de voz
    const connection = joinVoiceChannel({
      channelId: userChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    try {
      console.log('🎧 Descargando audio de prueba...');
      const res = await fetch('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const stream = res.body; // Stream válido en Node 22+
      const player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Play },
      });

      const resource = createAudioResource(stream);
      connection.subscribe(player);
      player.play(resource);

      message.reply('🎶 Reproduciendo sonido corto de prueba (3 s máx)...');
      console.log('🔊 TestSound reproduciendo...');

      // ⏱️ Cortar automáticamente a los 3 segundos
      const timeout = setTimeout(() => {
        console.log('⏹️ Corte automático a los 3 segundos');
        player.stop(true);
      }, 3000);

      // ✅ Cuando termina (natural o por stop), reanuda el silencio
      player.once(AudioPlayerStatus.Idle, () => {
        clearTimeout(timeout);
        console.log('✅ Sonido terminado — reiniciando silencio...');
        setTimeout(() => keepAlive(connection), 800);
      });

      // 💥 Manejo de errores en reproducción
      player.on('error', (err) => {
        clearTimeout(timeout);
        console.error('💥 Error al reproducir el audio:', err);
        setTimeout(() => keepAlive(connection), 1500);
      });
    } catch (err) {
      console.error('💥 Error ejecutando testsound:', err);
      await message.reply('❌ No se pudo obtener el audio (o hubo un error en el stream).');
      setTimeout(() => keepAlive(connection), 1500);
    }
  },
};
