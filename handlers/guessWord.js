import { sendMessage, makeInlineKeypad } from "../utils/api.js";
import { addScore, formatLeaderboard } from "../store/scores.js";
import words from "../data/words.json" with { type: "json" };

const activeGames = new Map(); // chatId -> { word, hint, masked }

export function getGuessMenu() {
  return makeInlineKeypad([
    [
      { id: "guess_new", text: "کلمه جدید 🔄" },
      { id: "guess_hint", text: "راهنمایی 💡" }
    ],
    [
      { id: "guess_end", text: "پایان بازی + رتبه 🏁" },
      { id: "back_menu", text: "بازگشت به منو 🔙" }
    ]
  ]);
}

export async function startGuessGame(chatId) {
  const item = words[Math.floor(Math.random() * words.length)];
  const masked = item.word.replace(/./g, "⬜");

  activeGames.set(chatId, {
    word: item.word.toLowerCase(),
    original: item.word,
    hint: item.hint,
    masked
  });

  await sendMessage(
    chatId,
    `🔤 **بازی حدس کلمه شروع شد!**\n\nکلمه: ${masked} (${item.word.length} حرف)\nراهنمایی: ${item.hint}\n\nهر کی زودتر درست حدس بزنه **۳ امتیاز** می‌گیره!\nفقط کافیه کلمه رو تایپ کنی.`,
    getGuessMenu()
  );
}

export async function handleGuessMessage(chatId, userId, userName, text) {
  const game = activeGames.get(chatId);
  if (!game) return false;

  const guess = text.trim().toLowerCase();
  if (guess === game.word) {
    addScore(chatId, userId, userName || "کاربر", 3);
    activeGames.delete(chatId);

    await sendMessage(
      chatId,
      `🎉 آفرین **${userName || "کاربر"}**!\n\nکلمه درست بود: **${game.original}**\n+۳ امتیاز گرفتی!\n\n${formatLeaderboard(chatId)}`,
      getGuessMenu()
    );
    return true;
  }
  return false;
}

export async function giveHint(chatId) {
  const game = activeGames.get(chatId);
  if (!game) {
    await sendMessage(chatId, "هیچ بازی فعالی وجود نداره. اول «کلمه جدید» رو بزن.", getGuessMenu());
    return;
  }
  await sendMessage(chatId, `💡 راهنمایی بیشتر: ${game.hint}`, getGuessMenu());
}

export async function endGuessGame(chatId) {
  const hadGame = activeGames.has(chatId);
  activeGames.delete(chatId);

  const text = hadGame
    ? `بازی تموم شد!\n\n${formatLeaderboard(chatId)}`
    : `بازی فعالی نبود.\n\n${formatLeaderboard(chatId)}`;

  await sendMessage(chatId, text, getGuessMenu());
}

export function isGuessActive(chatId) {
  return activeGames.has(chatId);
}
