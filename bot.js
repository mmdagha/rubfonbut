import express from "express";
import { TOKEN, API_BASE } from "./config.js";
import { api, sendMessage } from "./utils/api.js";
import { showMainMenu, showLeaderboard } from "./handlers/menu.js";
import { startTod, handleTodButton } from "./handlers/truthOrDare.js";
import { startWyr, nextWyr } from "./handlers/wouldYouRather.js";
import { startRps, handleRps } from "./handlers/rps.js";
import {
  startGuessGame,
  handleGuessMessage,
  giveHint,
  endGuessGame,
  isGuessActive
} from "./handlers/guessWord.js";
import { sendRandomJoke } from "./handlers/joke.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const chatState = new Map();

// ====================== پردازش دکمه‌ها ======================
async function handleButton(chatId, buttonId, userId = "unknown", userName = "کاربر") {
  if (buttonId === "game_tod") {
    chatState.set(chatId, "tod");
    await startTod(chatId);
    return;
  }
  if (buttonId === "game_wyr") {
    chatState.set(chatId, "wyr");
    await startWyr(chatId);
    return;
  }
  if (buttonId === "game_rps") {
    chatState.set(chatId, "rps");
    await startRps(chatId);
    return;
  }
  if (buttonId === "game_guess") {
    chatState.set(chatId, "guess");
    await startGuessGame(chatId);
    return;
  }
  if (buttonId === "game_joke") {
    await sendRandomJoke(chatId);
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
  if (buttonId === "wyr_next") {
    await nextWyr(chatId);
    return;
  }
  if (buttonId.startsWith("rps_")) {
    await handleRps(chatId, buttonId, userId, userName);
    return;
  }
  if (buttonId === "guess_new") await startGuessGame(chatId);
  if (buttonId === "guess_hint") await giveHint(chatId);
  if (buttonId === "guess_end") await endGuessGame(chatId);
}

// ====================== پردازش پیام ======================
async function processUpdate(update) {
  if (!update) return;

  // حالت عادی (NewMessage)
  if (update.type === "NewMessage") {
    const chatId = update.chat_id;
    const msg = update.new_message;
    if (!msg) return;

    const text = (msg.text || "").trim();
    const userId = msg.sender_id || "unknown";
    const buttonId = msg.aux_data?.button_id;

    const lower = text.toLowerCase();
    if (["/روبات", "/robot", "/menu", "/start", "روبات"].includes(lower)) {
      chatState.set(chatId, "menu");
      await showMainMenu(chatId);
      return;
    }

    if (buttonId) {
      await handleButton(chatId, buttonId, userId, "کاربر");
      return;
    }

    // حدس کلمه
    if (isGuessActive(chatId) && text) {
      await handleGuessMessage(chatId, userId, "کاربر", text);
    }
  }
}

// ====================== مسیرهای Webhook ======================

// روبیکا برای پیام‌های عادی به این آدرس می‌فرسته
app.post("/receiveUpdate", async (req, res) => {
  try {
    const body = req.body;
    // console.log("Update received:", JSON.stringify(body, null, 2));

    if (body.update) {
      await processUpdate(body.update);
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Error in /receiveUpdate:", err);
    res.status(200).send("OK"); // همیشه ۲۰۰ برگردون
  }
});

// روبیکا برای کلیک روی دکمه‌های شیشه‌ای (Inline) به این آدرس می‌فرسته
app.post("/receiveInlineMessage", async (req, res) => {
  try {
    const body = req.body;
    // console.log("Inline received:", JSON.stringify(body, null, 2));

    if (body.inline_message) {
      const inline = body.inline_message;
      const chatId = inline.chat_id;
      const buttonId = inline.aux_data?.button_id;
      const userId = inline.sender_id;

      if (buttonId) {
        await handleButton(chatId, buttonId, userId, "کاربر");
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Error in /receiveInlineMessage:", err);
    res.status(200).send("OK");
  }
});

// برای تست زنده بودن سرور
app.get("/", (req, res) => {
  res.send("Rubika Fun Bot is running ✅");
});

// ====================== تنظیم Webhook ======================
async function setWebhook(url) {
  try {
    // تنظیم endpoint برای پیام‌های عادی
    await api("updateBotEndpoint", {
      url: `${url}/receiveUpdate`,
      type: "ReceiveUpdate"
    });

    // تنظیم endpoint برای دکمه‌های شیشه‌ای
    await api("updateBotEndpoint", {
      url: `${url}/receiveInlineMessage`,
      type: "ReceiveInlineMessage"
    });

    console.log("✅ Webhook با موفقیت تنظیم شد");
  } catch (err) {
    console.error("خطا در تنظیم Webhook:", err.message);
  }
}

// ====================== شروع سرور ======================
app.listen(PORT, async () => {
  console.log(`🚀 سرور روی پورت ${PORT} روشن شد`);

  // اگر آدرس عمومی داری، اینجا تنظیمش کن
  // مثال: https://your-app.onrender.com
  const PUBLIC_URL = process.env.PUBLIC_URL || null;

  if (PUBLIC_URL) {
    await setWebhook(PUBLIC_URL);
  } else {
    console.log("⚠️  PUBLIC_URL تنظیم نشده. Webhook را دستی تنظیم کنید.");
  }
});