// src/handlers/distribution.ts

import { Composer, Context } from "grammy";
import { config } from "../config";
import { LoadBalancer } from "../services/load-balancer";

export const distributionHandler = new Composer<Context>();

// 👇 ДОБАВИТЬ EXPORT
export const balancer = new LoadBalancer(config.targetGroups);

distributionHandler.on("message", async (ctx) => {
    if (ctx.chat.id !== config.sourceGroupId) return;
    const text = ctx.message.text || ctx.message.caption;
    if (!text) return;

    const match = text.match(config.phoneRegex);
    if (match) {
        const phone = match[0];
        
        // 👇 Теперь передаем phone в метод getNextTarget
        const targetGroupId = balancer.getNextTarget(phone); 

        try {
            await ctx.copyMessage(targetGroupId);
            console.log(`✅ ${phone} -> ${targetGroupId}`);
        } catch (error) {
            console.error(`❌ Ошибка:`, error);
        }
    }
});