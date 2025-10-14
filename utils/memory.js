const memory = new Map();

function addMessage(channelId, role, content) {
  if (!memory.has(channelId)) {
    memory.set(channelId, []);
  }

  const msgs = memory.get(channelId);
  msgs.push({ role, content });

  if (msgs.length > 10) msgs.shift();

  memory.set(channelId, msgs);
}

function getContext(channelId) {
  return memory.get(channelId) || [];
}

module.exports = { addMessage, getContext };
