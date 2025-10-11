const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'image',
  description: 'Muestra la imagen de perfil (avatar) de un usuario.',
  async execute(message) {
    // Usuario mencionado o el propio autor si no se menciona a nadie
    const target = message.mentions.users.first() || message.author;

    // Armamos el embed
    const embed = new EmbedBuilder()
      .setColor('#5865F2') // violeta de Discord
      .setTitle(`🖼️ Avatar de ${target.username}`)
      .setImage(target.displayAvatarURL({ size: 1024, dynamic: true }))
      .setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    console.log(`🖼️ Mostrando avatar de ${target.username}`);
  },
};
