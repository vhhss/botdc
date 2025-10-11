const { Readable } = require('stream');
const { createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = (connection) => {
  const silence = new Readable({
    read() {
      this.push(Buffer.from([0xf8, 0xff, 0xfe]));
      this.push(null);
    },
  });

  const player = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Play },
  });

  const resource = createAudioResource(silence, { inlineVolume: true });
  player.play(resource);
  connection.subscribe(player);

  player.on(AudioPlayerStatus.Idle, () => {
    const silentRes = createAudioResource(silence, { inlineVolume: true });
    player.play(silentRes);
  });

  console.log('🔊 Silencio en loop activo');
};
