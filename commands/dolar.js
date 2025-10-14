const { EmbedBuilder } = require("discord.js");

// soporte universal para fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "dolar",
  description: "Muestra la cotización actual del dólar en Argentina",

  async execute(message) {
    try {
      const res = await fetch("https://dolarapi.com/v1/dolares");
      const data = await res.json();

      // Buscar los tipos más comunes
      const oficial = data.find(d => d.casa === "oficial");
      const blue = data.find(d => d.casa === "blue");

      if (!oficial || !blue) {
        return message.reply("⚠️ No se pudo obtener la cotización del dólar.");
      }

      const embed = new EmbedBuilder()
        .setTitle("💵 Cotización del Dólar en Argentina")
        .addFields(
          { name: "Oficial", value: `Compra: $${oficial.compra}\nVenta: $${oficial.venta}`, inline: true },
          { name: "Blue", value: `Compra: $${blue.compra}\nVenta: $${blue.venta}`, inline: true }
        )
        .setColor(0x2ecc71)
        .setFooter({ text: "Fuente: dolarapi.com" })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await message.reply("⚠️ Hubo un error al obtener la cotización del dólar.");
    }
  },
};
