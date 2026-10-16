import express from "express";
import { TOKEN, PORT } from "./config.js";
import { api } from "./utils/api.js";
import { showMainMenu, showLeaderboard } from "./handlers/menu.js";
import { startTod, handleTodButton } from "./handlers/truthOrDare.js";
import {
  startGuessGame,
  handleGuessMessage,
  endGuessGame,
  isGuessActive
} from "./handlers/guessWord.js";

const app = express();
app.use(express.json());

const chatState = new Map();

async function handleButton(chatId, buttonId, userId = "unknown", userName = "کاربر") {
  if (buttonId === "game_tod") {
    chatState.set(chatId, "tod");
    await startTod(chatId);
    return;
  }
  if (buttonId === "game_guess") {
    chatState.set(chatId, "guess");
    await startGuessGame(chatId);
    return;
  }
  if (buttonId === "leaderboard") {
    await showLeaderboard(chatId);
    return;
  }
  if (buttonId === "back_menu" || buttonId === "close") {
    chatState.set(chatId, "menu");
    await showMainMenu(chatId);
    return;
  }

  if (buttonId.startsWith("tod_")) {
    await handleTodButton(chatId, buttonId);
    return;
  }

  if (buttonId === "guess_new") {
    await startGuessGame(chatId);
    return;
  }
  if (buttonId === "guess_end") {
    await endGuessGame(chatId);
    return;
  }
}

async function processUpdate(update) {
  if (!update || update.type !== "NewMessage") return;

  const chatId = update.chat_id;
  const msg = update.new_message;
  if (!msg) return;

  // فقط در گروه جواب بده (پیوی نادیده گرفته می‌شود)
  // chat_id گروه‌ها معمولاً با b0 یا g0 شروع می‌شود
  if (!String(chatId).startsWith("b0") && !String(chatId).startsWith("g0")) {
    return;
  }

  const text = (msg.text || "").trim();
  const userId = msg.sender_id || "unknown";
  const buttonId = msg.aux_data?.button_id;

  const lower = text.toLowerCase();
  if (["/روبات", "/robot", "/menu", "/start", "روبات"].includes(lower)) {
    await showMainMenu(chatId);
    return;
  }

  if (buttonId) {
    await handleButton(chatId, buttonId, userId, "کاربر");
    return;
  }

  if (isGuessActive(chatId) && text.length > 0) {
    await handleGuessMessage(chatId, userId, "کاربر", text);
  }
}

// Webhook endpoints
app.post("/receiveUpdate", async (req, res) => {
  try {
    const body = req.body;
    if (body.update) {
      await processUpdate(body.update);
    }
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error in /receiveUpdate:", err.message);
    res.status(200).send("OK");
  }
});

app.post("/receiveInlineMessage", async (req, res) => {
  try {
    const body = req.body;
    if (body.inline_message) {
      const inline = body.inline_message;
      const chatId = inline.chat_id;

      // فقط گروه
      if (!String(chatId).startsWith("b0") && !String(chatId).startsWith("g0")) {
        return res.status(200).send("OK");
      }

      const buttonId = inline.aux_data?.button_id;
      const userId = inline.sender_id;

      if (buttonId) {
        await handleButton(chatId, buttonId, userId, "کاربر");
      }
    }
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error in /receiveInlineMessage:", err.message);
    res.status(200).send("OK");
  }
});

app.get("/", (req, res) => {
  res.send("Rubika Fun Bot is running ✅ (Group only)");
});

app.listen(PORT, () => {
  console.log(`🚀 سرور روی پورت ${PORT} روشن شد`);
  console.log(`📌 فقط داخل گروه کار می‌کند`);
});
