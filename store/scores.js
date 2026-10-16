const scores = new Map(); // chatId -> Map<userId, {name, score}>

export function addScore(chatId, userId, name, points = 1) {
  if (!scores.has(chatId)) scores.set(chatId, new Map());
  const chatScores = scores.get(chatId);

  if (!chatScores.has(userId)) {
    chatScores.set(userId, { name: name || "کاربر", score: 0 });
  }
  const user = chatScores.get(userId);
  user.score += points;
  if (name) user.name = name;
}

export function getLeaderboard(chatId, limit = 10) {
  if (!scores.has(chatId)) return [];
  return Array.from(scores.get(chatId).entries())
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function formatLeaderboard(chatId) {
  const board = getLeaderboard(chatId);
  if (board.length === 0) return "هنوز کسی امتیازی نگرفته!";

  let text = "🏆 **رتبه‌بندی فعلی گروه:**\n\n";
  board.forEach((item, i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
    text += `${medal} ${item.name} → **${item.score}** امتیاز\n`;
  });
  return text;
}

export function resetChatScores(chatId) {
  scores.delete(chatId);
}
