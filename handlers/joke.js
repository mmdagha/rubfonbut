import { sendMessage } from "../utils/api.js";
import { getMainMenu } from "./menu.js";
import jokes from "../data/jokes.json" with { type: "json" };

export async function sendRandomJoke(chatId) {
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  await sendMessage(chatId, `😂 **جوک:**\n\n${joke}`, getMainMenu());
}
