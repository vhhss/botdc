const warns = require('../data/warnsCache');
const KEY = (guildId, userId) => `${guildId}:${userId}`;

module.exports = {
  name: 'warn',
  description: 'Administra advertencias de usuarios. Uso: .warn @usuario [show|cls]',
  async execute(message, args) {
    // Permisos básicos
    if (!message.member.permissions.has('ModerateMembers') &&
        !message.member.permissions.has('ManageMessages')) {
      return message.reply('🚫 No tenés permisos para usar este comando.');
    }

    // Usuario mencionado
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply('⚠️ Usá: `.warn @usuario`, `.warn @usuario show` o `.warn @usuario cls`');
    }

    const key = KEY(message.guild.id, target.id);
    const action = (args[1] || '').toLowerCase();

    // === Mostrar advertencias ===
    if (action === 'show' || action === 'ver' || action === 'info') {
      const current = warns.get(key) || 0;
      return message.reply(`📋 ${target.user.username} tiene **${current}/3** advertencias.`);
    }

    // === Limpiar advertencias ===
    if (action === 'cls' || action === 'clear' || action === 'reset') {
      const current = warns.get(key);
      if (!current || current === 0) {
        return message.reply(`ℹ️ ${target.user.username} no tiene advertencias que limpiar.`);
      }
      warns.delete(key);
      await message.channel.send(`🧹 Se limpiaron todas las advertencias de ${target.user.username}.`);
      console.log(`🧹 Warns de ${target.user.username} eliminados.`);
      return;
    }

    // === Agregar advertencia ===
    // if (target.id === message.author.id)
    //   return message.reply('🙄 No te podés advertir a vos mismo.');
    if (target.user.bot)
      return message.reply('🤖 No puedo advertir a bots.');

    const current = warns.get(key) || 0;
    const next = current + 1;
    warns.set(key, next);

    await message.channel.send(`⚠️ ${target} recibió una advertencia.\n**Total: ${next}/3**`);

    // Si llega a 3, desconectar del canal de voz
    if (next >= 3) {
      const vs = target.voice;
      if (vs?.channel) {
        try {
          await vs.disconnect();
          await message.channel.send(`🚨 ${target.user.username} fue desconectado del canal de voz por acumular 3 warns.`);
        } catch (e) {
          console.error('Error al desconectar:', e);
          await message.channel.send('❌ No pude desconectarlo.');
        }
      } else {
        await message.channel.send(`⚠️ ${target.user.username} no está en un canal de voz.`);
      }
      warns.set(key, 0); // reseteamos después del castigo
    }
  },
};
