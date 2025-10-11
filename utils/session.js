const sessions = new Map();

function startSession(channelId) {
  sessions.set(channelId, true);
}

function endSession(channelId) {
  sessions.delete(channelId);
}

function inSession(channelId) {
  return sessions.has(channelId);
}

module.exports = { startSession, endSession, inSession };
