const Groq = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_KEY });

module.exports = async function aiReply(message) {
  try {
    // Obtener últimos 6 mensajes del canal para contexto
    const messages = await message.channel.messages.fetch({ limit: 6 });
    const context = Array.from(messages.values())
      .reverse()
      .map((m) => `${m.author.username}: ${m.content}`)
      .join("\n");

    // Llamada a Groq (modelo gratuito y rápido)
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "Sos un bot de Discord llamado 'mantengo el contador'. Tenés personalidad argentina, graciosa y un poco sarcástica. Respondé corto y natural, como si fueras parte de la charla. Evitá sonar robótico.",
        },
        {
          role: "user",
          content: `Contexto:\n${context}\n\nNuevo mensaje: ${message.content}`,
        },
      ],
      temperature: 0.9, // más creatividad
      max_tokens: 120,
    });

    const reply = completion.choices[0].message.content.trim();

    // Si el mensaje está vacío o da error, fallback amigable
    if (!reply) {
      return message.reply("😅 No sé qué decirte, gatin.");
    }

    await message.reply(reply);
  } catch (err) {
    console.error("💥 Error generando respuesta IA:", err);
    await message.reply("me mareé con tanto quilombo 😵‍💫");
  }
};
