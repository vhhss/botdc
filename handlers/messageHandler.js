const fs = require('fs');
const path = require('path');

const prefix = '.'; // podés cambiarlo por lo que quieras

module.exports = (message) => {
  // Ignorar mensajes del propio bot o sin prefijo
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const commandPath = path.join(__dirname, '..', 'commands', `${commandName}.js`);

  if (fs.existsSync(commandPath)) {
    const command = require(commandPath);
    try {
      command.execute(message, args);
    } catch (error) {
      console.error(`💥 Error ejecutando ${commandName}:`, error);
      message.reply('❌ Ocurrió un error ejecutando el comando.');
    }
  } else {
    message.reply('❓ Comando no reconocido.');
  }
};
