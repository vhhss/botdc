const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  name: 'join',
  description: 'Hace que el bot se una a tu canal de voz.',
  execute(message) {
    const userChannel = message.member?.voice?.channel;

    if (!userChannel) {
      return message.reply('❌ Tenés que estar en un canal de voz primero, gatin.');
    }

    joinVoiceChannel({
      channelId: userChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    message.reply(`🎧 Me uní al canal **${userChannel.name}**`);
    console.log(`➡️ Bot unido al canal: ${userChannel.name}`);
  },
};
