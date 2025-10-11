module.exports = {
  name: 'hug',
  description: 'Envía un abrazo anime a alguien o al azar.',
  async execute(message) {
    try {
      const response = await fetch('https://nekos.best/api/v2/hug');
      const data = await response.json();
      const hug = data.results[0];

      const target = message.mentions.users.first();
      const text = target
        ? `🫂 ${message.author.username} abrazó a ${target.username}!`
        : `🫂 ${message.author.username} reparte abrazos gratis~`;

      await message.channel.send({
        embeds: [
          {
            title: '💖 Abrazo anime',
            description: text,
            image: { url: hug.url },
            color: 0xffb6c1,
            footer: { text: 'Fuente: nekos.best' },
          },
        ],
      });
    } catch (err) {
      console.error('💥 Error mostrando abrazo:', err);
      message.reply('❌ No pude traer un abrazo ahora, gatin.');
    }
  },
};
