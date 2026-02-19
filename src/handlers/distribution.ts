// handlers/distribution.ts
import { Composer, Context } from "grammy";
import { config } from "../config";
import { LoadBalancer } from "../services/load-balancer";

export const distributionHandler = new Composer<Context>();
export const balancer = new LoadBalancer(config.targetGroups);

function cleanPhone(raw: string): string {
    return raw.replace(/[^\d+]/g, '');
}

// ДОБАВИЛИ аргумент next 👇
distributionHandler.on("message", async (ctx, next) => {
    // 1. Проверяем группу
    // Если ID чата не совпадает с группой-источником, мы передаем управление ДАЛЬШЕ
    // к другим обработчикам (меню, команды и т.д.)
    if (ctx.chat.id !== config.sourceGroupId) {
        return next(); // 👈 ИСПРАВЛЕНО ЗДЕСЬ
    }

    // 2. Собираем текст
    let textToScan = ctx.message.text || ctx.message.caption || "";
    
    if (ctx.message.contact && ctx.message.contact.phone_number) {
        textToScan += " " + ctx.message.contact.phone_number;
    }

    if (!textToScan) return; // Тут можно оставить return, так как мы уже внутри целевой группы

    // 3. Ищем ВСЕ совпадения
    const matches = textToScan.match(config.phoneRegex);

    if (!matches) return;

    const uniqueNumbers = [...new Set(matches.map(m => cleanPhone(m)))];

    for (const rawPhone of uniqueNumbers) {
        if (rawPhone.length < 9) continue; 

        // 4. Вызываем балансировщик
        const result = await balancer.getNextTarget(rawPhone);

        let replyText = "";

        if (result.isOverflow) {
            replyText = `⛔️ **Лимит исчерпан!**\nНомер \`${rawPhone}\` сохранен в базу, но никуда не отправлен.`;
        } else {
            try {
                // ВАЖНО: copyMessage требует chat_id, откуда копировать.
                // Если мы просто копируем сообщение в целевую группу:
                if (result.targetId) {
                    // Используем copyMessage(куда, откуда, id_сообщения)
                    await ctx.api.copyMessage(result.targetId, ctx.chat.id, ctx.message.message_id);
                }
                
                replyText = `✅ **Принято:** \`${rawPhone}\`\n` + 
                            `➡️ **Куда:** ${result.targetName}`;

            } catch (error) {
                console.error(`❌ Ошибка отправки:`, error);
                replyText = `❌ **Ошибка отправки:** \`${rawPhone}\`\nНе удалось переслать в группу.`;
            }
        }

        if (result.isDuplicate) {
            replyText += `\n\n⚠️ **ЭТО ДУБЛИКАТ!**\n${result.duplicateDetails}`;
        }

        await ctx.reply(replyText, { 
            parse_mode: "Markdown",
            reply_to_message_id: ctx.message.message_id 
        });
        
        console.log(`Log: ${rawPhone} -> ${result.targetName} (Дубль: ${result.isDuplicate})`);
    }
});