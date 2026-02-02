import { Composer, Context } from "grammy";
import { config } from "../config";
import { LoadBalancer } from "../services/load-balancer";

export const distributionHandler = new Composer<Context>();

// Инициализируем балансировщик один раз при запуске
const balancer = new LoadBalancer(config.targetGroups);

// Слушаем любые сообщения (текст или фото с подписью)
distributionHandler.on("message", async (ctx) => {
    // 1. ФИЛЬТР: Проверяем, что сообщение пришло именно из Группы-Источника
    if (ctx.chat.id !== config.sourceGroupId) {
        return; // Если это личка или другая группа — игнорируем
    }

    // Получаем текст
    const text = ctx.message.text || ctx.message.caption;
    if (!text) return;

    // 2. ПОИСК НОМЕРА
    const match = text.match(config.phoneRegex);

    if (match) {
        const phone = match[0];
        
        // 3. БАЛАНСИРОВКА: Получаем ID следующей группы
        const targetGroupId = balancer.getNextTarget();

        try {
            // Копируем сообщение в целевую группу (copyMessage скрывает пересылку, выглядит как новое)
            await ctx.copyMessage(targetGroupId);
            
            console.log(`✅ Номер ${phone} перенаправлен в группу ${targetGroupId}`);
            
            // Опционально: Можно удалить сообщение из источника, чтобы не засорять
            // await ctx.deleteMessage(); 
            
        } catch (error) {
            console.error(`❌ Ошибка отправки в группу ${targetGroupId}:`, error);
        }
    }
});