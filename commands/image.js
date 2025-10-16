const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
require("dotenv").config();
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "image",
  description: "Busca imágenes en Google y te deja pasar entre varias",
  
  async execute(message, args) {
    const query = args.join(" ");
    if (!query) return message.reply("🔍 Tenés que escribir qué imagen querés buscar. Ejemplo: `.image gatos`");

    const API_KEY = process.env.GOOGLE_API_KEY;
    const CX = process.env.GOOGLE_CX;

    try {
      const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${CX}&key=${API_KEY}&searchType=image&num=10&safe=active`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        return message.reply(`❌ No encontré imágenes para **${query}**.`);
      }

      let index = 0;

      const generateEmbed = (i) => {
        const item = data.items[i];
        return new EmbedBuilder()
          .setTitle(`🖼️ Imagen ${i + 1} de ${data.items.length} — ${query}`)
          .setImage(item.link)
          .setURL(item.image.contextLink)
          .setColor(0x0099ff)
          .setFooter({ text: "Fuente: Google Images" });
      };

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("⬅️ Anterior")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("➡️ Siguiente")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setLabel("❌ Cerrar")
          .setStyle(ButtonStyle.Danger)
      );

      const msg = await message.reply({ embeds: [generateEmbed(index)], components: [row] });

      const collector = msg.createMessageComponentCollector({
        time: 30_000, // 1 minuto
      });

      collector.on("collect", async (interaction) => {
        if (interaction.user.id !== message.author.id) {
          return interaction.reply({ content: "⛔ Solo el que pidió la imagen puede usar los botones.", ephemeral: true });
        }

        if (interaction.customId === "prev") {
          index = (index - 1 + data.items.length) % data.items.length;
        } else if (interaction.customId === "next") {
          index = (index + 1) % data.items.length;
        } else if (interaction.customId === "stop") {
          collector.stop("closed");
          return interaction.update({ components: [] });
        }

        await interaction.update({ embeds: [generateEmbed(index)], components: [row] });
      });

      collector.on("end", async () => {
        try {
          await msg.edit({ components: [] });
        } catch {}
      });
    } catch (error) {
      console.error(error);
      await message.reply("⚠️ Ocurrió un error al buscar imágenes.");
    }
  },
};
