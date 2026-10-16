import { sendMessage, makeInlineKeypad } from "../utils/api.js";
import { addScore } from "../store/scores.js";

export function getRpsMenu() {
  return makeInlineKeypad([
    [
      { id: "rps_rock", text: "سنگ ✊" },
      { id: "rps_paper", text: "کاغذ ✋" },
      { id: "rps_scissors", text: "قیچی ✌️" }
    ],
    [
      { id: "back_menu", text: "بازگشت به منو 🔙" }
    ]
  ]);
}

export async function startRps(chatId) {
  await sendMessage(chatId, "سنگ، کاغذ یا قیچی؟ انتخاب کن:", getRpsMenu());
}

export async function handleRps(chatId, buttonId, userId, userName) {
  const choices = {
    rps_rock: "سنگ ✊",
    rps_paper: "کاغذ ✋",
    rps_scissors: "قیچی ✌️"
  };
  const userChoice = choices[buttonId];
  if (!userChoice) return;

  const botChoices = ["سنگ ✊", "کاغذ ✋", "قیچی ✌️"];
  const botChoice = botChoices[Math.floor(Math.random() * 3)];

  let result = "";
  let points = 0;

  if (userChoice === botChoice) {
    result = "مساوی شدیم! 😐";
  } else if (
    (userChoice === "سنگ ✊" && botChoice === "قیچی ✌️") ||
    (userChoice === "کاغذ ✋" && botChoice === "سنگ ✊") ||
    (userChoice === "قیچی ✌️" && botChoice === "کاغذ ✋")
  ) {
    result = "تو بردی! 🎉 +۱ امتیاز";
    points = 1;
  } else {
    result = "من بردم! 😈";
  }

  if (points > 0) {
    addScore(chatId, userId, userName, points);
  }

  await sendMessage(
    chatId,
    `تو: ${userChoice}\nمن: ${botChoice}\n\n${result}`,
    getRpsMenu()
  );
}
