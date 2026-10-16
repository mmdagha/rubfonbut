import { sendMessage, makeInlineKeypad } from "../utils/api.js";
import truths from "../data/truths.json" with { type: "json" };
import dares from "../data/dares.json" with { type: "json" };

export function getTodMenu() {
  return makeInlineKeypad([
    [
      { id: "tod_truth", text: "حقیقت 🗣️" },
      { id: "tod_dare", text: "جرات 🔥" }
    ],
    [
      { id: "tod_random", text: "تصادفی 🎲" },
      { id: "back_menu", text: "بازگشت به منو 🔙" }
    ]
  ]);
}

export async function startTod(chatId) {
  await sendMessage(
    chatId,
    "حالت **حقیقت یا جرات** فعال شد!\nیکی از گزینه‌ها رو انتخاب کن:",
    getTodMenu()
  );
}

export async function handleTodButton(chatId, buttonId) {
  if (buttonId === "tod_truth") {
    const item = truths[Math.floor(Math.random() * truths.length)];
    await sendMessage(chatId, `🗣️ **حقیقت:**\n\n${item}`, getTodMenu());
  } else if (buttonId === "tod_dare") {
    const item = dares[Math.floor(Math.random() * dares.length)];
    await sendMessage(chatId, `🔥 **جرات:**\n\n${item}`, getTodMenu());
  } else if (buttonId === "tod_random") {
    const isTruth = Math.random() > 0.5;
    if (isTruth) {
      const item = truths[Math.floor(Math.random() * truths.length)];
      await sendMessage(chatId, `🎲 → 🗣️ **حقیقت:**\n\n${item}`, getTodMenu());
    } else {
      const item = dares[Math.floor(Math.random() * dares.length)];
      await sendMessage(chatId, `🎲 → 🔥 **جرات:**\n\n${item}`, getTodMenu());
    }
  }
}
