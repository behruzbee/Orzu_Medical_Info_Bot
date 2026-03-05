import { webhookCallback } from "grammy";
import { bot } from "../src/bot"; // Убедитесь, что путь к bot.ts правильный

const handleUpdate = webhookCallback(bot, "http");

// @ts-ignore
export default async function (req, res) {
    try {
        await handleUpdate(req, res);
    } catch (err) {
        console.error("Webhook Error:", err);
        res.status(500).send("Error");
    }
}