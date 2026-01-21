import { Bot, Context } from "grammy";
import * as dotenv from "dotenv";
import { aboutHandler } from "./handlers/about";
import { contactsHandler } from "./handlers/contacts";
import { pricesHandler } from "./handlers/prices";
import { faqHandler } from "./handlers/faq";
import { commandsHandler } from "./handlers/commans";

dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is missing in .env");
}

export const bot = new Bot<Context>(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
    console.log(`📩 Пришло сообщение: ${JSON.stringify(ctx.update, null, 2)}`);
    await next(); // Передает управление дальше к командам
});

// Подключаем модули
bot.use(commandsHandler);
bot.use(aboutHandler);
bot.use(contactsHandler);
bot.use(pricesHandler);
bot.use(faqHandler);

// Ловим ошибки
bot.catch((err) => {
    console.error("Error in bot:", err);
});