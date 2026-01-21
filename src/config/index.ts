import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("❌ Ошибка: BOT_TOKEN не найден в .env");
}

export const config = {
    botToken: process.env.BOT_TOKEN,
};