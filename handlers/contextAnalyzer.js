module.exports = async function analyzeContext(channel) {
  try {
    const messages = await channel.messages.fetch({ limit: 5 }); // últimos 5 mensajes
    const contentList = [...messages.values()].map(m => m.content.toLowerCase());

    const joinedText = contentList.join(' ');

    // palabras clave según tipo de contexto
    const peleaKeywords = ['no', 'callate', 'cállate', 'boludo', 'idiota', 'mentira', 'vos', 'cerrá', 'tonto', 'wtf'];
    const humorKeywords = ['jaj', 'xd', '🤣', '😂', 'wtf', '😹', '😆'];
    const chillKeywords = ['hola', 'tranqui', 'bien', 'todo piola', 'gracias', 'ok'];

    let score = { pelea: 0, humor: 0, chill: 0 };

    for (const word of peleaKeywords) if (joinedText.includes(word)) score.pelea++;
    for (const word of humorKeywords) if (joinedText.includes(word)) score.humor++;
    for (const word of chillKeywords) if (joinedText.includes(word)) score.chill++;

    // Determinar contexto dominante
    const max = Object.entries(score).sort((a, b) => b[1] - a[1])[0];

    if (!max || max[1] === 0) return 'neutral';
    return max[0]; // devuelve 'pelea', 'humor', 'chill' o 'neutral'
  } catch (err) {
    console.error('💥 Error analizando contexto:', err);
    return 'neutral';
  }
};
