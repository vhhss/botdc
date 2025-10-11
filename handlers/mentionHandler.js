const Groq = require('groq-sdk');
const { addMessage, getContext } = require('../utils/memory');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async (message) => {
  try {
    const channelId = message.channel.id;

    // Recupera el contexto del canal, pero solo mensajes del usuario
    const context = getContext(channelId)
      .filter(msg => msg.role === 'user')
      .map(msg => ({ role: 'user', content: msg.content }));

    // Agrega el mensaje actual del usuario
    addMessage(channelId, 'user', message.content);

    // Genera la respuesta con Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Sos un chica llamada "Yuzuru" tenes mala memoria, solo recordas los ultimos 10 mensajes. Respondés con frases cortas, claras y un toque de humor. No te extendés mucho.`
        },
        ...context,
        { role: 'user', content: message.content }
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    const reply = completion.choices[0].message.content;

    // No guardamos respuestas del bot (solo las del usuario)
    await message.reply(reply);

  } catch (error) {
    console.error('💥 Error generando respuesta IA (Groq):', error);
    await message.reply('😿 Estoy medio tildada, gatin. Probá más tarde.');
  }
};
