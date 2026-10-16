import { sendMessage, makeInlineKeypad } from "../utils/api.js";
import { formatLeaderboard } from "../store/scores.js";

export function getMainMenu() {
  return makeInlineKeypad([
    [
      { id: "game_tod", text: "حقیقت یا جرات 🔥" },
      { id: "game_guess", text: "حدس کلمه 🔤" }
    ],
    [
      { id: "leaderboard", text: "رتبه‌بندی 🏆" },
      { id: "close", text: "بستن منو ❌" }
    ]
  ]);
}

export async function showMainMenu(chatId) {
  await sendMessage(
    chatId,
    "سلام! 👋 به ربات سرگرمی خوش اومدی 🎮\n\nفقط داخل گروه کار می‌کنه.\nیکی از بازی‌ها رو انتخاب کن:",
    getMainMenu()
  );
}

export async function showLeaderboard(chatId) {
  const text = formatLeaderboard(chatId);
  await sendMessage(chatId, text, getMainMenu());
}
