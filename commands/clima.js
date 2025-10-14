const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

// fetch compatible con cualquier versión de Node
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "clima",
  description: "Muestra el clima actual de una ciudad",
  
  async execute(message, args) {
    const ciudad = args.join(" ");
    if (!ciudad) return message.reply("🌍 Tenés que escribir una ciudad. Ejemplo: `.clima Córdoba`");

    const API_KEY = process.env.OPENWEATHER_API_KEY;

    try {
      // 1️⃣ Buscar coordenadas con la API de geolocalización
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(ciudad)}&limit=1&appid=${API_KEY}`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.length) {
        return message.reply(`❌ No encontré la ciudad **${ciudad}**.`);
      }

      const { lat, lon, name, country } = geoData[0];

      // 2️⃣ Obtener el clima usando las coordenadas
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
      const weatherRes = await fetch(weatherUrl);
      const data = await weatherRes.json();

      const clima = data.weather[0].description;
      const temp = data.main.temp.toFixed(1);
      const humedad = data.main.humidity;
      const viento = data.wind.speed;
      const icono = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      const embed = new EmbedBuilder()
        .setTitle(`Clima en ${name}, ${country}`)
        .setDescription(`**${clima.toUpperCase()}**`)
        .setThumbnail(icono)
        .addFields(
          { name: "🌡 Temperatura", value: `${temp}°C`, inline: true },
          { name: "💧 Humedad", value: `${humedad}%`, inline: true },
          { name: "💨 Viento", value: `${viento} m/s`, inline: true }
        )
        .setColor(0x1e90ff)
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await message.reply("⚠️ Hubo un error al obtener el clima.");
    }
  },
};
