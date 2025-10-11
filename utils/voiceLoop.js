console.log('🧩 Módulo voiceLoop cargado');
const { Readable } = require('stream');
const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  StreamType,
} = require('@discordjs/voice');

module.exports = (connection) => {
  console.log('🚀 Ejecutando voiceLoop()');

  // Crea un stream que manda frames de silencio
  const silence = new Readable({
    read() {
      this.push(Buffer.from([0xf8, 0xff, 0xfe])); // Frame de silencio válido
    },
  });

  const player = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Play },
  });

  // 👇 Especificamos que el stream es de tipo Ogg/Opus (para que no use FFmpeg)
  const resource = createAudioResource(silence, {
    inputType: StreamType.Opus,
  });

  player.play(resource);
  connection.subscribe(player);

  player.on(AudioPlayerStatus.Playing, () =>
    console.log('🔊 Enviando silencio (manteniendo conexión activa)')
  );

  player.on(AudioPlayerStatus.Idle, () => {
    console.log('💤 Re-iniciando bucle de silencio...');
    player.play(createAudioResource(silence, { inputType: StreamType.Opus }));
  });

  console.log('🔁 Silencio infinito activado');
};
