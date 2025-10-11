module.exports = {
  name: 'nsfwlist',
  description: 'Muestra las categorías disponibles para contenido NSFW leve.',
  execute(message) {
    const categories = [
      '🔹 waifu — imágenes sugerentes (NSFW leve)',
      '🔹 hug — abrazos anime 💞',
      '🔹 kiss — besos anime 😳',
      '🔹 neko — chicas gato 🐾 (si agregás el comando)',
    ];

    message.channel.send({
      embeds: [
        {
          title: '🌸 Categorías NSFW permitidas',
          description: categories.join('\n'),
          color: 0xff99cc,
          footer: { text: 'Cumple con las políticas de Discord 💫' },
        },
      ],
    });
  },
};
