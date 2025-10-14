const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'image',
  description: 'Busca imágenes en Unsplash y muestra quién lo solicitó',
  async execute(message, args) {
    const query = args.join(' ');
    if (!query) return message.reply('🖼️ Tenés que escribir algo, por ejemplo: `.image gato`');

    const loadingMessage = await message.channel.send(`🔍 Buscando imágenes de: **${query}**...`);

    try {
      const res = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, per_page: 3 },
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
      });

      const results = res.data.results;
      if (!results || results.length === 0) return loadingMessage.edit('❌ No encontré ninguna imagen.');

      let currentIndex = 0;

      const createEmbed = (index) =>
        new EmbedBuilder()
          .setTitle(`Resultados de: ${query}`)
          .setURL(results[index].links.html)
          .setColor('Random')
          .setImage(results[index].urls.regular)
          .setFooter({ text: `Foto de ${results[index].user.name} en Unsplash | Pedido por ${message.author.username}` });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('prev').setLabel('⬅️').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('next').setLabel('➡️').setStyle(ButtonStyle.Primary)
      );

      const msg = await loadingMessage.edit({ content: null, embeds: [createEmbed(currentIndex)], components: [row] });

      const collector = msg.createMessageComponentCollector({ time: 120000 });

      collector.on('collect', async (interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'prev') {
          currentIndex = (currentIndex - 1 + results.length) % results.length;
        } else if (interaction.customId === 'next') {
          currentIndex = (currentIndex + 1) % results.length;
        }

        await interaction.update({ embeds: [createEmbed(currentIndex)] });
      });

      collector.on('end', async () => {
        await msg.edit({ components: [] });
      });

    } catch (err) {
      console.error('Error buscando imagen en Unsplash:', err.message);
      await loadingMessage.edit('⚠️ Hubo un error al buscar la imagen.');
    }
  },
};
