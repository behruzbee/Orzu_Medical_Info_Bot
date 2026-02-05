// handlers/distribution.ts
import { Composer, Context } from "grammy";
import { config } from "../config";
import { LoadBalancer } from "../services/load-balancer";

export const distributionHandler = new Composer<Context>();
export const balancer = new LoadBalancer(config.targetGroups);

// Функция очистки: убираем пробелы, скобки, тире. Оставляем только цифры и плюс.
function cleanPhone(raw: string): string {
    return raw.replace(/[^\d+]/g, '');
}

distributionHandler.on("message", async (ctx) => {
    // 1. Проверяем группу
    if (ctx.chat.id !== config.sourceGroupId) return;

    // 2. Собираем текст
    let textToScan = ctx.message.text || ctx.message.caption || "";
    
    // Если это контакт, добавляем его номер в текст для проверки
    if (ctx.message.contact && ctx.message.contact.phone_number) {
        textToScan += " " + ctx.message.contact.phone_number;
    }

    if (!textToScan) return;

    // 3. Ищем ВСЕ совпадения (флаг 'g' в конфиге обязателен)
    // Используем match или matchAll
    const matches = textToScan.match(config.phoneRegex);

    if (!matches) return;

    // Чтобы не обрабатывать один и тот же номер дважды в одном сообщении
    const uniqueNumbers = [...new Set(matches.map(m => cleanPhone(m)))];

    for (const rawPhone of uniqueNumbers) {
        // Проверка на длину (чтобы отсечь короткие "обрывки" типа +7)
        if (rawPhone.length < 9) continue; 

        // 4. Вызываем балансировщик
        const result = await balancer.getNextTarget(rawPhone);

        let replyText = "";

        if (result.isOverflow) {
            // Если места нет
            replyText = `⛔️ **Лимит исчерпан!**\nНомер \`${rawPhone}\` сохранен в базу, но никуда не отправлен.`;
        } else {
            // Пытаемся отправить
            try {
                if (result.targetId) {
                    await ctx.copyMessage(result.targetId);
                }
                
                replyText = `✅ **Принято:** \`${rawPhone}\`\n` + 
                            `➡️ **Куда:** ${result.targetName}`;

            } catch (error) {
                console.error(`❌ Ошибка отправки:`, error);
                replyText = `❌ **Ошибка отправки:** \`${rawPhone}\`\nНе удалось переслать в группу.`;
            }
        }

        // 5. ДОБАВЛЯЕМ ИНФО О ДУБЛИКАТЕ (Если он есть)
        if (result.isDuplicate) {
            replyText += `\n\n⚠️ **ЭТО ДУБЛИКАТ!**\n${result.duplicateDetails}`;
        }

        // 6. Отвечаем в чат
        await ctx.reply(replyText, { 
            parse_mode: "Markdown",
            reply_to_message_id: ctx.message.message_id 
        });
        
        console.log(`Log: ${rawPhone} -> ${result.targetName} (Дубль: ${result.isDuplicate})`);
    }
});