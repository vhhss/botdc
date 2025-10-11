module.exports = {
  name: 'cls',
  description: 'Limpia mensajes relacionados con el bot o comandos recientes.',
  async execute(message) {
    const channel = message.channel;
    const botId = message.client.user.id;

    try {
      const fetched = await channel.messages.fetch({ limit: 100 });

      // Mensajes que se pueden borrar
      const deletables = fetched.filter((m) => {
        const mentionsBot = m.mentions.users.has(botId);
        const isBot = m.author.id === botId;
        const isCommand = m.content.startsWith('.');

        return isBot || mentionsBot || isCommand;
      });

      if (deletables.size === 0) {
        return message.reply('🧹 No hay mensajes para limpiar, gatin.').then((msg) => {
          setTimeout(() => msg.delete().catch(() => {}), 5000);
        });
      }

      await channel.bulkDelete(deletables, true);

      const confirm = await message.channel.send({
        content: `🧽 Se limpiaron **${deletables.size}** mensajes relacionados con el bot.`,
      });

      // ⏳ Borrar el mensaje de confirmación después de 5 segundos
      setTimeout(() => {
        confirm.delete().catch(() => {});
      }, 5000);

    } catch (err) {
      console.error('💥 Error ejecutando cls:', err);
      const errMsg = await message.reply('❌ No pude limpiar el chat, gatin.');
      setTimeout(() => errMsg.delete().catch(() => {}), 5000);
    }
  },
};
