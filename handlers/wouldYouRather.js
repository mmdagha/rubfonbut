import { sendMessage, makeInlineKeypad } from "../utils/api.js";
import questions from "../data/wouldYouRather.json" with { type: "json" };

export function getWyrMenu() {
  return makeInlineKeypad([
    [
      { id: "wyr_next", text: "سوال بعدی ➡️" },
      { id: "back_menu", text: "بازگشت به منو 🔙" }
    ]
  ]);
}

export async function startWyr(chatId) {
  const q = questions[Math.floor(Math.random() * questions.length)];
  await sendMessage(chatId, `🤔 **ترجیح می‌دادی؟**\n\n${q}`, getWyrMenu());
}

export async function nextWyr(chatId) {
  const q = questions[Math.floor(Math.random() * questions.length)];
  await sendMessage(chatId, `🤔 **ترجیح می‌دادی؟**\n\n${q}`, getWyrMenu());
}
