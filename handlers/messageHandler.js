const fs = require('fs');
const path = require('path');
const handleMention = require('./mentionHandler');
const { addMessage } = require('../utils/memory');
const { startSession, endSession, inSession } = require('../utils/session');

module.exports = async (message) => {
  const prefix = '.';
  const botId = message.client.user.id;
  if (message.author.bot) return;

  const mentionsBot = message.mentions.users.has(botId);

  // Guarda mensajes del canal (menos los del bot y los que lo mencionan)
  if (!mentionsBot && message.author.id !== botId) {
    addMessage(message.channel.id, 'user', message.content);
  }

  // Si hay sesión activa, responde sin que lo mencionen
  if (inSession(message.channel.id)) {
    const content = message.content.toLowerCase();

    // Si el usuario se despide, termina la charla
    if (/(chau|adios|nos vemos|me voy|bye|nv|no re vimo)/i.test(content)) {
      endSession(message.channel.id);
      return message.reply('Dale, chau 👋 nos vemos.');
    }

    await handleMention(message);
    return;
  }

  // Si lo mencionan, inicia una sesión de charla
  if (mentionsBot) {
    startSession(message.channel.id);
    await handleMention(message);
    return;
  }

  // Si es un comando normal
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const commandPath = path.join(__dirname, '..', 'commands', `${commandName}.js`);

    if (fs.existsSync(commandPath)) {
      const command = require(commandPath);
      await command.execute(message, args);
    }
  }
};
