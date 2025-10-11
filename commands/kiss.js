module.exports = {
  name: 'kiss',
  description: 'Envía un beso anime a alguien.',
  async execute(message) {
    try {
      const response = await fetch('https://nekos.best/api/v2/kiss');
      const data = await response.json();
      const kiss = data.results[0];

      const target = message.mentions.users.first();
      const text = target
        ? `💋 ${message.author.username} besó a ${target.username} 😳`
        : `💋 ${message.author.username} lanza besitos al aire~`;

      await message.channel.send({
        embeds: [
          {
            title: '💞 Beso anime',
            description: text,
            image: { url: kiss.url },
            color: 0xff69b4,
            footer: { text: 'Fuente: nekos.best' },
          },
        ],
      });
    } catch (err) {
      console.error('💥 Error mostrando beso:', err);
      message.reply('❌ No pude traer un beso ahora, gatin.');
    }
  },
};
