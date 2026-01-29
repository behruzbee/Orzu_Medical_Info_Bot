import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { faqKeyboard, backKeyboard } from "../keyboards";

export const faqHandler = new Composer<Context>();

faqHandler.callbackQuery(BotAction.FAQ, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("❓ Выберите интересующий вопрос:", { reply_markup: faqKeyboard });
});

// Новый обработчик списка услуг из фото
faqHandler.callbackQuery("faq_included", async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = 
        `✅ **Что входит в стоимость путевки?**\n` +
        `_Все процедуры включены в цену (доплат нет):_\n\n` +
        `🏠 **Проживание и Питание** (диетическое)\n` +
        `👨‍⚕️ **Консультация и Диагностика**\n` +
        `💊 **Лекарства и Капельницы**\n\n` +
        
        `🧬 **Процедуры:**\n` +
        `• Физиотерапия\n` +
        `• Массаж и Иглотерапия\n` +
        `• Хиджама и Апитерапия (пчелы)\n` +
        `• Озонотерапия\n` +
        `• Сокотерапия и Фитотерапия\n` +
        `• Зондирование\n` +
        `• Лазеротерапия\n` +
        `• Парафин\n` +
        `• Кислородная пенка\n\n` +
        
        `🧖‍♀️ **SPA и Релакс:**\n` +
        `• Аромасауна\n` +
        `• ✨ Тренинги счастья`;

    await ctx.reply(text, { reply_markup: backKeyboard, parse_mode: "Markdown" });
});

faqHandler.callbackQuery("faq_duration", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
        "📅 **Курс лечения — 10 дней.**\n\n" +
        "Это оптимальный срок для полного очищения печени (3 этапа), кишечника и перезапуска иммунитета.",
        { reply_markup: backKeyboard, parse_mode: "Markdown" }
    );
});

faqHandler.callbackQuery("faq_diseases", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
        "💊 **Мы устраняем причину болезней — шлаки:**\n\n" +
        "✅ Сахарный диабет 2 типа\n" +
        "✅ Давление (Гипертония)\n" +
        "✅ Лишний вес и ожирение печени\n" +
        "✅ Кожные заболевания, псориаз, аллергии\n" +
        "✅ Боли в суставах, грыжи",
        { reply_markup: backKeyboard, parse_mode: "Markdown" }
    );
});