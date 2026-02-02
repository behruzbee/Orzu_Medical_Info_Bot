import { Composer, Context } from "grammy";
import { config } from "../config";
import { balancer } from "./distribution";

export const adminHandler = new Composer<Context>();

// 🛡️ Middleware: Проверка на админа (чтобы обычные юзеры не тыкали)
// Вставьте свои ID админов в массив
const ADMIN_IDS = [6049496733]; // Ваш ID

const isAdmin = (ctx: Context) => {
    return ctx.from && ADMIN_IDS.includes(ctx.from.id);
};

// 1. /ping — Проверка жизни
adminHandler.command("ping", async (ctx) => {
    if (!isAdmin(ctx)) return;
    const uptime = Math.floor((new Date().getTime() - balancer.startTime.getTime()) / 1000);
    await ctx.reply(`🏓 **Понг! Бот активен.**\n⏱ Аптайм: ${uptime} сек.\n🚀 Сервер: Vercel`, { parse_mode: "Markdown" });
});

// 2. /status — Общая сводка
adminHandler.command("status", async (ctx) => {
    if (!isAdmin(ctx)) return;
    const { nextTargetId } = balancer.getQueueStatus();
    
    await ctx.reply(
        `📊 **Статус системы:**\n\n` +
        `✅ Обработано номеров: **${balancer.totalProcessed}**\n` +
        `🎯 Следующая группа: \`${nextTargetId}\`\n` +
        `👥 Всего целевых групп: **${config.targetGroups.length}**`,
        { parse_mode: "Markdown" }
    );
});

// 3. /last — Куда ушел последний номер?
adminHandler.command("last", async (ctx) => {
    if (!isAdmin(ctx)) return;
    const last = balancer.lastDistribution;
    
    if (!last) {
        return ctx.reply("ℹ️ С момента запуска распределений еще не было.");
    }

    await ctx.reply(
        `🕵️‍♂️ **Последнее распределение:**\n\n` +
        `📱 Номер: **${last.phone}**\n` +
        `➡️ Группа: \`${last.targetId}\`\n` +
        `🕒 Время: ${last.time}`,
        { parse_mode: "Markdown" }
    );
});

// 4. /id — Узнать ID текущей группы (Полезно для настройки)
adminHandler.command("id", async (ctx) => {
    await ctx.reply(
        `🆔 **ID этого чата:** \`${ctx.chat.id}\`\n` +
        `👤 **Ваш ID:** \`${ctx.from?.id}\``,
        { parse_mode: "Markdown" }
    );
});

// 5. /groups — Список групп, куда идет распределение
adminHandler.command("groups", async (ctx) => {
    if (!isAdmin(ctx)) return;
    let msg = "📋 **Целевые группы (Очередь):**\n";
    
    config.targetGroups.forEach((id, index) => {
        // Помечаем стрелочкой следующую группу
        const isNext = balancer.getQueueStatus().currentIndex === index;
        msg += `${isNext ? "👉" : "#"}${index + 1}: \`${id}\`\n`;
    });
    
    await ctx.reply(msg, { parse_mode: "Markdown" });
});

// 6. /source — Какую группу мы слушаем?
adminHandler.command("source", async (ctx) => {
    if (!isAdmin(ctx)) return;
    await ctx.reply(`🎧 **Источник заявок:**\nID Группы: \`${config.sourceGroupId}\``, { parse_mode: "Markdown" });
});

// 7. /check — Проверка регулярки (Тест номера)
adminHandler.command("check", async (ctx) => {
    if (!isAdmin(ctx)) return;
    // Пример использования: /check +998901234567
    const text = ctx.match as string; // Текст после команды
    if (!text) return ctx.reply("⚠️ Введите номер для проверки. Пример:\n`/check +998901234567`", { parse_mode: "Markdown" });

    const match = text.match(config.phoneRegex);
    if (match) {
        await ctx.reply(`✅ **Номер найден!**\nБот видит его как: \`${match[0]}\``, { parse_mode: "Markdown" });
    } else {
        await ctx.reply(`❌ Номер не распознан. Проверьте формат.`, { parse_mode: "Markdown" });
    }
});

// 8. /admin — Проверка прав
adminHandler.command("admin", async (ctx) => {
    if (isAdmin(ctx)) {
        await ctx.reply("👨‍✈️ Вы распознаны как **Администратор**.");
    } else {
        await ctx.reply("👤 Вы обычный пользователь (доступ к командам закрыт).");
    }
});

// 9. /help_admin — Показать этот список
adminHandler.command("help_admin", async (ctx) => {
    if (!isAdmin(ctx)) return;
    await ctx.reply(
        `🛠 **Команды Администратора:**\n\n` +
        `/status - Статистика и очередь\n` +
        `/last - Последний распределенный номер\n` +
        `/ping - Проверка активности\n` +
        `/groups - Список целевых групп\n` +
        `/source - Группа-источник\n` +
        `/id - Узнать ID чата\n` +
        `/check <номер> - Тест распознавания\n` +
        `/version - Версия бота`,
        { parse_mode: "Markdown" }
    );
});

// 10. /version — Версия
adminHandler.command("version", async (ctx) => {
    await ctx.reply("🤖 **Orzu Distrib Bot v2.0**\nArchitecture: SOLID\nPlatform: Vercel", { parse_mode: "Markdown" });
});