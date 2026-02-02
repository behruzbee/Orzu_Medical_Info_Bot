import { Bot } from "grammy";
import { config } from "../src/config";
import { balancer } from "../src/handlers/distribution"; // Тот же экземпляр

const bot = new Bot(config.botToken);

export default async function handler(request: Request) {
    try {
        console.log("Cron started...");

        // Генерируем отчет (используем bot.api, так как ctx нет)
        const report = await balancer.getDailyReport(bot.api);
        
        // Отправляем в группу источник (или можно указать ID админа)
        await bot.api.sendMessage(config.sourceGroupId, report, { parse_mode: "Markdown" });
        
        // Сбрасываем статистику
        balancer.resetDailyStats();

        console.log("Cron finished successfully");
        return new Response('Report sent and stats reset', { status: 200 });
    } catch (error) {
        console.error("Cron Error:", error);
        return new Response(`Error: ${error}`, { status: 500 });
    }
}