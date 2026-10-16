import { API_BASE } from "../config.js";

export async function api(method, body = {}) {
  try {
    const res = await fetch(`${API_BASE}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.error("API Error:", err.message);
    return null;
  }
}

export async function sendMessage(chatId, text, inlineKeypad = null) {
  const body = {
    chat_id: chatId,
    text: text
  };
  if (inlineKeypad) {
    body.inline_keypad = inlineKeypad;
  }
  return api("sendMessage", body);
}

export function makeInlineKeypad(rows) {
  return {
    rows: rows.map(row => ({
      buttons: row.map(btn => ({
        id: btn.id,
        type: "Simple",
        button_text: btn.text
      }))
    }))
  };
}

export async function getChat(chatId) {
  return api("getChat", { chat_id: chatId });
}
