module.exports = {
  name: 'waifu',
  description: 'Muestra una waifu sugerente (solo en canales NSFW).',
  async execute(message) {
    // Verificar si el canal es NSFW
    if (!message.channel.nsfw) {
      return message.reply('⚠️ Este comando solo se puede usar en canales NSFW, gatin.');
    }

    try {
      // API de waifu.pics NSFW leve
      const response = await fetch('https://api.waifu.pics/sfw/waifu');
      const data = await response.json();

      // Enviar imagen en embed
      await message.channel.send({
        embeds: [
          {
            title: '💋 Tu waifu te saluda~',
            image: { url: data.url },
            color: 0xff66b2,
            footer: { text: `Pedido por ${message.author.username}` },
          },
        ],
      });
    } catch (err) {
      console.error('💥 Error mostrando waifu:', err);
      message.reply('❌ No pude traer una waifu ahora, intentalo más tarde.');
    }
  },
};
