import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { faqKeyboard, backKeyboard } from "../keyboards";

export const faqHandler = new Composer<Context>();

faqHandler.callbackQuery(BotAction.FAQ, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("❓ **Выберите интересующий вопрос:**", { reply_markup: faqKeyboard, parse_mode: "Markdown" });
});

faqHandler.callbackQuery("faq_included", async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = 
        `💎 **Формат «Всё включено»**\n` +
        `_Вы платите один раз — никаких скрытых доплат!_\n\n` +
        
        `🛏 **Базовый комфорт:**\n` +
        `• Проживание в уютных палатах\n` +
        `• Специальное диетическое питание\n` +
        `• Консультации врачей и полная диагностика\n` +
        `• Все необходимые лекарства и капельницы\n\n` +
        
        `🧬 **Медицинские процедуры:**\n` +
        `• Очищение (зондирование, клизмы)\n` +
        `• Физиотерапия, УЗТ, УВЧ и электрофорез\n` +
        `• Хиджама, иглотерапия и апитерапия (пчелы)\n` +
        `• Лечебный массаж и парафинотерапия\n` +
        `• Озоно- и лазеротерапия\n` +
        `• Фитотерапия и кислородные пенки\n\n` +
        
        `🧘‍♀️ **Душа и тело:**\n` +
        `• Аромасауна\n` +
        `• Психотренинги («Тренинги счастья»)\n` +
        `• Лечебная гимнастика`;

    await ctx.reply(text, { reply_markup: backKeyboard, parse_mode: "Markdown" });
});

faqHandler.callbackQuery("faq_duration", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
        "⏳ **Сколько длится курс?**\n\n" +
        "Стандартный курс лечения — **10 дней.**\n\n" +
        "Именно столько времени нужно, чтобы поэтапно и безопасно очистить печень, кишечник и желчные пути, а также запустить естественное восстановление иммунитета.",
        { reply_markup: backKeyboard, parse_mode: "Markdown" }
    );
});

faqHandler.callbackQuery("faq_diseases", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
        "🛡 **С какими проблемами мы помогаем?**\n\n" +
        "_Мы лечим причину, а не следствие. К нам обращаются при:_\n\n" +
        "🔸 Сахарном диабете 2 типа\n" +
        "🔸 Гипертонии (повышенном давлении)\n" +
        "🔸 Остеохондрозе, болях в суставах, грыжах и артрозах\n" +
        "🔸 Лишнем весе и жировом гепатозе печени\n" +
        "🔸 Проблемах с ЖКТ (хронический панкреатит и др.)\n" +
        "🔸 Кожных заболеваниях (псориаз, аллергии)",
        { reply_markup: backKeyboard, parse_mode: "Markdown" }
    );
});