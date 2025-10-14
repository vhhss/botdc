const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'image',
  description: 'Galería de imágenes de Unsplash con navegación y cierre automático',
  async execute(message, args) {
    const query = args.join(' ');
    if (!query) return message.reply('🖼️ Tenés que escribir algo, por ejemplo: `.image gato`');

    const loadingMessage = await message.channel.send(`🔍 Buscando imágenes de: **${query}**...`);

    let results = [];
    let currentPage = 1;
    let currentIndex = 0;

    const fetchImages = async (page = 1) => {
      const res = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, per_page: 10, page },
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
      });
      return res.data.results;
    };

    try {
      results = await fetchImages(currentPage);
      if (!results || results.length === 0) return loadingMessage.edit('❌ No encontré ninguna imagen.');

      const createEmbed = (index) =>
        new EmbedBuilder()
          .setTitle(`Resultados de: ${query}`)
          .setURL(results[index].links.html)
          .setColor('Random')
          .setImage(results[index].urls.regular)
          .setFooter({
            text: `Foto de ${results[index].user.name} | Pedido por ${message.author.username}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('prev').setLabel('⬅️').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('next').setLabel('➡️').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('stop').setLabel('❌ Cerrar').setStyle(ButtonStyle.Danger)
      );

      const msg = await loadingMessage.edit({ content: null, embeds: [createEmbed(currentIndex)], components: [row] });

      const collector = msg.createMessageComponentCollector({ time: 45000 }); // 3 minutos

      collector.on('collect', async (interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.user.id !== message.author.id)
          return interaction.reply({ content: '❌ Solo quien pidió puede usar los botones.', ephemeral: true });

        if (interaction.customId === 'prev') {
          currentIndex = (currentIndex - 1 + results.length) % results.length;
          await interaction.update({ embeds: [createEmbed(currentIndex)] });
        } else if (interaction.customId === 'next') {
          currentIndex++;
          if (currentIndex >= results.length) {
            currentPage++;
            const moreResults = await fetchImages(currentPage);
            if (moreResults.length === 0) {
              currentIndex = results.length - 1;
              return interaction.update({ content: '⚠️ No hay más imágenes.', embeds: [createEmbed(currentIndex)] });
            }
            results = results.concat(moreResults);
          }
          await interaction.update({ embeds: [createEmbed(currentIndex)] });
        } else if (interaction.customId === 'stop') {
          await msg.edit({ components: [] });
          collector.stop();
        }
      });

      collector.on('end', async () => {
        await msg.edit({ components: [] });
      });

    } catch (err) {
      console.error('Error buscando imagen en Unsplash:', err.message);
      await loadingMessage.edit('⚠️ Hubo un error al buscar la imagen. Verifica tu API Key de Unsplash.');
    }
  },
};
