import { Bot } from "grammy";
import { config } from "../src/config";
import { balancer } from "../src/handlers/distribution"; 

const bot = new Bot(config.botToken);

export default async function handler() {
    try {
        // Вызываем в 9 утра, поэтому запрашиваем данные за "вчера" (true)
        const report = await balancer.getDailyReport(bot.api, true);
        
        await bot.api.sendMessage(config.sourceGroupId, report, { 
            parse_mode: "Markdown" 
        });
        
        return new Response('Report sent', { status: 200 });
    } catch (error) {
        console.error("Cron Error:", error);
        return new Response('Error', { status: 500 });
    }
}