import { sendMessage, makeInlineKeypad } from "../utils/api.js";
import { addScore, formatLeaderboard } from "../store/scores.js";
import words from "../data/words.json" with { type: "json" };

const activeGames = new Map();

export function getGuessMenu() {
  return makeInlineKeypad([
    [
      { id: "guess_new", text: "کلمه جدید 🔄" },
      { id: "guess_end", text: "پایان بازی + رتبه 🏁" }
    ],
    [
      { id: "back_menu", text: "بازگشت به منو 🔙" }
    ]
  ]);
}

export async function startGuessGame(chatId) {
  const item = words[Math.floor(Math.random() * words.length)];
  const masked = item.word.replace(/./g, "⬜");

  activeGames.set(chatId, {
    word: item.word.toLowerCase(),
    original: item.word
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

export async function endGuessGame(chatId) {
  activeGames.delete(chatId);
  await sendMessage(
    chatId,
    `بازی تموم شد!\n\n${formatLeaderboard(chatId)}`,
    getGuessMenu()
  );
}

export function isGuessActive(chatId) {
  return activeGames.has(chatId);
}
