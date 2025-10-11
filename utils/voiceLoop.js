const { Readable } = require('stream');
const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require('@discordjs/voice');

module.exports = (connection) => {
  // stream que nunca se cierra, manda silencio continuo
  const silence = new Readable({
    read() {
      this.push(Buffer.from([0xf8, 0xff, 0xfe]));
    },
  });

  const player = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Play },
  });

  const resource = createAudioResource(silence, { inlineVolume: true });
  player.play(resource);
  connection.subscribe(player);

  player.on(AudioPlayerStatus.Playing, () => {
    console.log('🔊 Enviando silencio (manteniendo conexión activa)');
  });

  player.on(AudioPlayerStatus.Idle, () => {
    console.log('💤 AudioPlayer en idle, reiniciando silencio');
    const res = createAudioResource(silence, { inlineVolume: true });
    player.play(res);
  });

  console.log('🔁 Silencio infinito activado');
};
