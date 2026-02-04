import { Composer, Context } from "grammy";
import { config } from "../config";
import { LoadBalancer } from "../services/load-balancer";

export const distributionHandler = new Composer<Context>();

// Экспортируем экземпляр
export const balancer = new LoadBalancer(config.targetGroups);

distributionHandler.on("message", async (ctx) => {
    if (ctx.chat.id !== config.sourceGroupId) return;

    const text = ctx.message.text || ctx.message.caption;
    if (!text) return;

    const match = text.match(config.phoneRegex);

    if (match) {
        const phone = match[0];
        
        // 👇 ИЗМЕНЕНИЕ: getNextTarget может вернуть null (если все планы выполнены)
        const targetGroupId = await balancer.getNextTarget(phone); 

        // Если вернулся null — значит все группы полные, никуда не отправляем
        if (targetGroupId === null) {
            console.log(`⚠️ Лимит исчерпан. Номер ${phone} сохранен в "Остаток".`);
            return;
        }

        try {
            await ctx.copyMessage(targetGroupId);
            console.log(`✅ ${phone} -> ${targetGroupId}`);
        } catch (error) {
            console.error(`❌ Ошибка отправки в ${targetGroupId}:`, error);
        }
    }
});