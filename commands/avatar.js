const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Muestra el avatar de un usuario, ID o tu propio avatar si no pasas nada',
  async execute(message, args) {
    let user;

    if (!args.length) {
      // Si no pasan argumentos, usamos al autor del mensaje
      user = message.author;
    } else {
      // Intentamos obtener el usuario por ID
      const id = args[0].replace(/\D/g, '');
      try {
        user = await message.client.users.fetch(id); // trae usuario aunque no esté en el servidor
      } catch {
        return message.reply('❌ No encontré ningún usuario con ese ID.');
      }
    }

    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}#${user.discriminator}`)
      .setImage(avatarUrl)
      .setColor('Random')
      .setFooter({
        text: `Pedido por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });

    return message.reply({ embeds: [embed] });
  },
};
