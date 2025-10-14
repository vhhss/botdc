const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'emoji',
  description: 'Muestra un emoji en grande y quién lo pidió',
  async execute(message, args) {
    if (!args.length) 
      return message.reply('💡 Tenés que poner un emoji, por ejemplo: `.emoji 😎` o `.emoji <:miemoji:123456>`');

    const input = args[0];

    // Emoji personalizado de Discord (<:nombre:id> o <a:nombre:id>)
    const customEmoji = input.match(/<a?:\w+:(\d+)>/);

    if (customEmoji) {
      const id = customEmoji[1];
      const animated = input.startsWith('<a:');
      const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}`;

      const embed = new EmbedBuilder()
        .setTitle('Emoji ampliado')
        .setImage(url)
        .setColor('Random')
        .setFooter({
          text: `Pedido por ${message.author.username}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        });

      return message.reply({ embeds: [embed] });
    }

    // Emoji unicode normal
    const embed = new EmbedBuilder()
      .setTitle('Emoji ampliado')
      .setDescription(input)
      .setColor('Random')
      .setFooter({
        text: `Pedido por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });

    return message.reply({ embeds: [embed] });
  },
};