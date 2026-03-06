import { Bot, Context, GrammyError, HttpError } from "grammy";
import * as dotenv from "dotenv";
import { aboutHandler } from "./handlers/about";
import { contactsHandler } from "./handlers/contacts";
import { pricesHandler } from "./handlers/prices";
import { faqHandler } from "./handlers/faq";
import { commandsHandler } from "./handlers/commans";
import { distributionHandler } from "./handlers/distribution";
import { adminHandler } from "./handlers/admin";
import { checkupHandler } from "./handlers/checkup";
import { bmiHandler } from "./handlers/bmi";
import { diaryHandler } from "./handlers/diary";

dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is missing in .env");
}

export const bot = new Bot<Context>(process.env.BOT_TOKEN);


// Подключение модулей
bot.use(adminHandler);
bot.use(distributionHandler);
bot.use(diaryHandler)
bot.use(commandsHandler);
bot.use(aboutHandler);
bot.use(contactsHandler);
bot.use(pricesHandler);
bot.use(faqHandler);
bot.use(checkupHandler);
bot.use(bmiHandler);

// --- ГЛАВНОЕ ИСПРАВЛЕНИЕ: Умная обработка ошибок ---
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Ошибка при обработке update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        // Если ошибка "query is too old", мы её просто игнорируем
        if (e.description.includes("query is too old")) {
            console.warn("⚠️ Игнорируем дубликат запроса (query is too old)");
            return; 
        }
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});