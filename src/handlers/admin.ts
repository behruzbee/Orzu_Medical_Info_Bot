import { Composer, Context } from "grammy";
import { config } from "../config";
// Импортируем экземпляр балансировщика
import { balancer } from "./distribution"; 

export const adminHandler = new Composer<Context>();

// Массив ID администраторов
const ADMIN_IDS = [6049496733]; 

// Функция проверки прав
const isAdmin = (ctx: Context) => {
    return ctx.from && ADMIN_IDS.includes(ctx.from.id);
};

// ===================== КОМАНДЫ =====================

// 1. /ping — Проверка аптайма
adminHandler.command("ping", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    // balancer.startTime существует (мы добавили его в LoadBalancer)
    const uptime = Math.floor((new Date().getTime() - balancer.startTime.getTime()) / 1000);
    
    await ctx.reply(
        `🏓 **Понг! Бот активен.**\n` +
        `⏱ Аптайм: ${uptime} сек.\n` +
        `🚀 База данных: MongoDB`, 
        { parse_mode: "Markdown" }
    );
});

// 2. /status — Краткая статистика
adminHandler.command("status", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    // 👇 ИСПРАВЛЕНИЕ: Используем новый метод getQueueStatusData()
    const data = await balancer.getQueueStatusData();
    
    await ctx.reply(
        `📊 **Статус (MongoDB):**\n\n` +
        `📥 Всего заявок сегодня: **${data.totalToday}**\n` +
        `⛔️ В остатке (сверх плана): **${data.overflow}**\n` +
        `👥 Активных групп-целей: **${config.groupsConfig.length}**`,
        { parse_mode: "Markdown" }
    );
});

// 3. /last — Последний распределенный номер
adminHandler.command("last", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    // 👇 ИСПРАВЛЕНИЕ: Используем метод getLastDistribution() вместо свойства lastDistribution
    const last = await balancer.getLastDistribution();
    
    if (!last) {
        return ctx.reply("ℹ️ Распределений еще не было.");
    }

    await ctx.reply(
        `🕵️‍♂️ **Последняя заявка:**\n\n` +
        `📱 Номер: **${last.phone}**\n` +
        `➡️ Куда: **${last.targetName}**\n` +
        `🕒 Время: ${last.time}`,
        { parse_mode: "Markdown" }
    );
});

// 4. /report — Полный отчет
adminHandler.command("report", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    await ctx.reply("⏳ Генерирую отчет...");
    
    try {
        const reportText = await balancer.getDailyReport(ctx.api);
        await ctx.reply(reportText, { parse_mode: "Markdown" });
    } catch (e) {
        await ctx.reply("❌ Ошибка генерации отчета: " + e);
    }
});

// 5. /groups — Список планов
adminHandler.command("groups", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    // 👇 ИСПРАВЛЕНИЕ: Используем getGroupsList() вместо getQueueStatusWithNames()
    const groups = await balancer.getGroupsList();
    
    let msg = "📋 **Настройки планов:**\n\n";
    
    // 👇 ИСПРАВЛЕНИЕ: Явно указываем тип item или позволяем TS вывести его из конфига
    groups.forEach((g) => {
        msg += `🔹 **${g.name}**: Лимит ${g.limit}\n`;
    });
    
    await ctx.reply(msg, { parse_mode: "Markdown" });
});

// 6. /id — Узнать ID чата
adminHandler.command("id", async (ctx) => {
    await ctx.reply(
        `🆔 **ID этого чата:** \`${ctx.chat.id}\`\n` +
        `👤 **Ваш ID:** \`${ctx.from?.id}\``,
        { parse_mode: "Markdown" }
    );
});

// 7. /source — Источник заявок
adminHandler.command("source", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    await ctx.reply(
        `🎧 **Источник заявок:**\n` +
        `ID Группы: \`${config.sourceGroupId}\``, 
        { parse_mode: "Markdown" }
    );
});

// 8. /check — Тест номера
adminHandler.command("check", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    const text = ctx.match as string; 
    
    if (!text) {
        return ctx.reply("⚠️ Введите номер для проверки.\nПример: `/check +998901234567`", { parse_mode: "Markdown" });
    }

    const match = text.match(config.phoneRegex);
    
    if (match) {
        await ctx.reply(`✅ **Номер найден!**\nБот видит его как: \`${match[0]}\``, { parse_mode: "Markdown" });
    } else {
        await ctx.reply(`❌ Номер не распознан.`, { parse_mode: "Markdown" });
    }
});

// 8. /getAllNumbers — Получить все номера
adminHandler.command("getAllNumbers", async (ctx) => {
    if (!isAdmin(ctx)) return;

    const numbers = await balancer.getAllNumbers();
    if (!numbers || numbers.length === 0) {
        return ctx.reply("⚠️ Номера не найдены.", { parse_mode: "Markdown" });
    }

    const msg = numbers.map((n) => `- ${n}`).join("\n");
    await ctx.reply(`📋 **Все номера:**\n\n${msg}`, { parse_mode: "Markdown" });
});

// 9. /admin — Проверка прав
adminHandler.command("admin", async (ctx) => {
    if (isAdmin(ctx)) {
        await ctx.reply("👨‍✈️ Вы распознаны как **Администратор**.");
    } else {
        await ctx.reply("👤 Вы обычный пользователь.");
    }
});

// 10. /help_admin — Помощь
adminHandler.command("help_admin", async (ctx) => {
    if (!isAdmin(ctx)) return;
    
    await ctx.reply(
        `🛠 **Команды Администратора:**\n\n` +
        `/status - Краткая сводка\n` +
        `/report - Полный отчет выполнения плана\n` +
        `/groups - Список лимитов по группам\n` +
        `/last - Последний номер\n` +
        `/check <номер> - Тест распознавания\n` +
        `/ping - Аптайм\n` +
        `/source - Группа-источник\n` +
        `/id - Узнать ID чата`,
        { parse_mode: "Markdown" }
    );
});

// 11. /version
adminHandler.command("version", async (ctx) => {
    await ctx.reply(
        "🤖 **Orzu Distrib Bot v2.1**\n" +
        "Mode: Limits & Overflow\n" +
        "DB: MongoDB", 
        { parse_mode: "Markdown" }
    );
});