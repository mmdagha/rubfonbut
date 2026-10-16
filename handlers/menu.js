import { sendMessage, makeInlineKeypad } from "../utils/api.js";
import { formatLeaderboard } from "../store/scores.js";

export function getMainMenu() {
  return makeInlineKeypad([
    [
      { id: "game_tod", text: "حقیقت یا جرات 🔥" },
      { id: "game_wyr", text: "ترجیح می‌دادی؟ 🤔" }
    ],
    [
      { id: "game_rps", text: "سنگ کاغذ قیچی ✊" },
      { id: "game_guess", text: "حدس کلمه 🔤" }
    ],
    [
      { id: "game_joke", text: "جوک تصادفی 😂" },
      { id: "leaderboard", text: "رتبه‌بندی 🏆" }
    ],
    [
      { id: "close", text: "بستن منو ❌" }
    ]
  ]);
}

export async function showMainMenu(chatId) {
  await sendMessage(
    chatId,
    "سلام! 👋 به ربات سرگرمی خوش اومدی 🎮\n\nیکی از بازی‌ها یا امکانات زیر رو انتخاب کن:",
    getMainMenu()
  );
}

export async function showLeaderboard(chatId) {
  const text = formatLeaderboard(chatId);
  await sendMessage(chatId, text, getMainMenu());
}
