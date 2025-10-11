// utils/memory.js
const memory = new Map(); // un mapa por canal

function addMessage(channelId, role, content) {
  if (!memory.has(channelId)) {
    memory.set(channelId, []);
  }

  const msgs = memory.get(channelId);
  msgs.push({ role, content });

  // Solo guarda los últimos 5
  if (msgs.length > 10) msgs.shift();

  memory.set(channelId, msgs);
}

function getContext(channelId) {
  return memory.get(channelId) || [];
}

module.exports = { addMessage, getContext };
