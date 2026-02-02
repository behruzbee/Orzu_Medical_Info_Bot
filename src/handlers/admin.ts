import { Composer, Context } from "grammy";
import { config } from "../config";
// 👇 Импортируем ЭКЗЕМПЛЯР балансировщика, созданный в distribution.ts
// Это важно, чтобы мы видели ту же статистику, что и распределитель
import { balancer } from "./distribution"; 

export const adminHandler = new Composer<Context>();

// 🛡️ Middleware: Проверка на админа
// Замените ID на свои, если их несколько
const ADMIN_IDS = [6049496733]; 

const isAdmin = (ctx: Context) => {
    return ctx.from && ADMIN_IDS.includes(ctx.from.id);
};

// ===================== КОМАНДЫ =====================

// 1. /ping — Проверка, жив ли бот (и сколько он уже работает без перезагрузки)
adminHandler.command("ping", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    const uptime = Math.floor((new Date().getTime() - balancer.startTime.getTime()) / 1000);
    
    await ctx.reply(
        `🏓 **Понг! Бот активен.**\n` +
        `⏱ Аптайм: ${uptime} сек.\n` +
        `🚀 Среда: Vercel/Serverless`, 
        { parse_mode: "Markdown" }
    );
});

// 2. /status — Краткая статистика в реальном времени
adminHandler.command("status", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    const { nextTargetId } = balancer.getQueueStatus();
    
    await ctx.reply(
        `📊 **Статус системы:**\n\n` +
        `✅ Обработано номеров: **${balancer.stats.totalRequests}**\n` +
        `🎯 Следующая группа ID: \`${nextTargetId}\`\n` +
        `👥 Всего целевых групп: **${config.targetGroups.length}**`,
        { parse_mode: "Markdown" }
    );
});

// 3. /last — Куда ушел последний номер (для разборок)
adminHandler.command("last", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    const last = balancer.lastDistribution;
    
    if (!last) {
        return ctx.reply("ℹ️ С момента запуска распределений еще не было.");
    }

    await ctx.reply(
        `🕵️‍♂️ **Последнее распределение:**\n\n` +
        `📱 Номер: **${last.phone}**\n` +
        `➡️ Группа ID: \`${last.targetId}\`\n` +
        `🕒 Время: ${last.time}`,
        { parse_mode: "Markdown" }
    );
});

// 4. /report — Ручной запуск ежедневного отчета
adminHandler.command("report", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    await ctx.reply("⏳ Генерирую отчет, собираю названия групп...");
    
    try {
        // Передаем ctx.api, чтобы получить красивые названия групп вместо ID
        const reportText = await balancer.getDailyReport(ctx.api);
        await ctx.reply(reportText, { parse_mode: "Markdown" });
    } catch (e) {
        await ctx.reply("❌ Ошибка генерации отчета: " + e);
    }
});

// 5. /groups — Список всех групп в очереди с названиями
adminHandler.command("groups", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    await ctx.reply("⏳ Загружаю список групп...");
    
    try {
        const queue = await balancer.getQueueStatusWithNames(ctx.api);
        let msg = "📋 **Целевые группы (Очередь):**\n\n";
        
        queue.forEach((item, index) => {
            // 👉 показывает, чья сейчас очередь
            msg += `${item.isNext ? "👉" : "#"} **${index + 1}. ${item.title}**\n`;
        });
        
        await ctx.reply(msg, { parse_mode: "Markdown" });
    } catch (e) {
        await ctx.reply("❌ Ошибка получения списка: " + e);
    }
});

// 6. /id — Узнать ID чата и свой ID (полезно для настройки .env)
adminHandler.command("id", async (ctx) => {
    await ctx.reply(
        `🆔 **ID этого чата:** \`${ctx.chat.id}\`\n` +
        `👤 **Ваш ID:** \`${ctx.from?.id}\``,
        { parse_mode: "Markdown" }
    );
});

// 7. /source — Напоминание, какую группу мы слушаем
adminHandler.command("source", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    await ctx.reply(
        `🎧 **Источник заявок:**\n` +
        `ID Группы: \`${config.sourceGroupId}\``, 
        { parse_mode: "Markdown" }
    );
});

// 8. /check — Тест регулярного выражения
// Пример: /check +998901234567
adminHandler.command("check", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    const text = ctx.match as string; // Текст после команды
    
    if (!text) {
        return ctx.reply("⚠️ Введите номер для проверки.\nПример: `/check +998901234567`", { parse_mode: "Markdown" });
    }

    const match = text.match(config.phoneRegex);
    
    if (match) {
        await ctx.reply(`✅ **Номер найден!**\nБот видит его как: \`${match[0]}\``, { parse_mode: "Markdown" });
    } else {
        await ctx.reply(`❌ Номер не распознан. Проверьте формат или регулярку.`, { parse_mode: "Markdown" });
    }
});

// 9. /admin — Проверка прав (видит ли бот вас как админа)
adminHandler.command("admin", async (ctx) => {
    if (isAdmin(ctx)) {
        await ctx.reply("👨‍✈️ Вы распознаны как **Администратор**.");
    } else {
        await ctx.reply("👤 Вы обычный пользователь (доступ к командам управления закрыт).");
    }
});

// 10. /help_admin — Список всех доступных команд
adminHandler.command("help_admin", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    await ctx.reply(
        `🛠 **Команды Администратора:**\n\n` +
        `/status - Статистика и очередь\n` +
        `/report - Полный отчет за день\n` +
        `/groups - Список целевых групп\n` +
        `/last - Последний распределенный номер\n` +
        `/check <номер> - Тест распознавания\n` +
        `/ping - Проверка активности\n` +
        `/source - Группа-источник\n` +
        `/id - Узнать ID чата\n` +
        `/version - Версия бота`,
        { parse_mode: "Markdown" }
    );
});

// 11. /version
adminHandler.command("version", async (ctx) => {
    await ctx.reply(
        "🤖 **Orzu Distrib Bot v2.0**\n" +
        "Architecture: SOLID\n" +
        "Platform: Vercel Serverless", 
        { parse_mode: "Markdown" }
    );
});