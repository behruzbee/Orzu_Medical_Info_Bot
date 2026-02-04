import { Bot } from "grammy";
import { config } from "../src/config";
import { balancer } from "../src/handlers/distribution"; 

const bot = new Bot(config.botToken);

export default async function handler(request: Request) {
    try {
        console.log("Cron started...");

        // Генерируем отчет
        // (Этот метод сам сделает запрос в БД за сегодняшний день)
        const report = await balancer.getDailyReport(bot.api);
        
        // Отправляем отчет в группу-источник
        await bot.api.sendMessage(config.sourceGroupId, report, { parse_mode: "Markdown" });
        
        // ❌ УДАЛЕНО: balancer.resetDailyStats(); 
        // В MongoDB сбрасывать ничего не нужно, завтра бот просто начнет считать новый день по дате.

        console.log("Cron finished successfully");
        return new Response('Report sent successfully', { status: 200 });
    } catch (error) {
        console.error("Cron Error:", error);
        return new Response(`Error: ${error}`, { status: 500 });
    }
}