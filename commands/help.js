const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Muestra la lista de comandos disponibles y sus descripciones.',
  async execute(message) {
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

    const commandList = [];

    for (const file of commandFiles) {
      // Evitar incluir el propio help en la lista (opcional)
      if (file === 'help.js') continue;

      const command = require(path.join(commandsPath, file));
      const name = command.name || path.parse(file).name;
      const desc = command.description || 'Sin descripción disponible.';
      commandList.push({ name, desc });
    }

    const embed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle('📜 Lista de Comandos')
      .setDescription('Usá los comandos con el prefijo `.` (por ejemplo `.join`, `.warn @usuario`, etc.)')
      .addFields(
        commandList.map(cmd => ({
          name: `.${cmd.name}`,
          value: cmd.desc,
          inline: false,
        }))
      )
      .setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    console.log('📘 Comando .help ejecutado');
  },
};
