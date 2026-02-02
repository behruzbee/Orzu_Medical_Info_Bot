import { Composer, Context } from "grammy";
import { config } from "../config";
import { LoadBalancer } from "../services/load-balancer";

export const distributionHandler = new Composer<Context>();

// ⚠️ ЭКСПОРТИРУЕМ экземпляр, чтобы им пользовались admin.ts и cron.ts
export const balancer = new LoadBalancer(config.targetGroups);

distributionHandler.on("message", async (ctx) => {
    // 1. Фильтр: только из группы-источника
    if (ctx.chat.id !== config.sourceGroupId) return;

    const text = ctx.message.text || ctx.message.caption;
    if (!text) return;

    // 2. Поиск номера
    const match = text.match(config.phoneRegex);

    if (match) {
        const phone = match[0];
        
        // 3. Получаем цель и пишем статистику
        const targetGroupId = balancer.getNextTarget(phone); 

        try {
            await ctx.copyMessage(targetGroupId);
            console.log(`✅ ${phone} -> ${targetGroupId}`);
        } catch (error) {
            console.error(`❌ Ошибка отправки в ${targetGroupId}:`, error);
        }
    }
});