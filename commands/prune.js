module.exports = {
  name: 'prune',
  description: 'Borra una cantidad de mensajes del canal actual.',
  async execute(message, args) {
    // Verifica permisos
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply('🚫 No tenés permisos para borrar mensajes, gatin.');
    }

    // Verifica argumento
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('⚠️ Tenés que poner un número entre 1 y 100.');
    }

    try {
      // Borramos los mensajes (más el comando)
      const deleted = await message.channel.bulkDelete(amount + 1, true);

      // Respuesta visual
      const reply = await message.channel.send(
        `🧹 Se eliminaron **${deleted.size - 1}** mensajes.`
      );

      // Borramos el aviso a los 5 segundos
      setTimeout(() => reply.delete().catch(() => {}), 5000);

      console.log(`🧽 Prune ejecutado: ${deleted.size - 1} mensajes eliminados.`);
    } catch (err) {
      console.error('💥 Error al ejecutar prune:', err);
      message.reply('❌ Ocurrió un error al intentar borrar los mensajes.');
    }
  },
};
