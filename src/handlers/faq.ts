import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { generateFaqKeyboard, generateBackKeyboard } from "../keyboards";
import { t } from "../locales";
import { UserModel } from "../db/models";

export const faqHandler = new Composer<Context>();

// Функция для получения языка
async function getUserLang(userId: number): Promise<'ru' | 'uz' | 'kz'> {
    try {
        const user = await UserModel.findOne({ telegramId: userId });
        if (user && user.language) return user.language as 'ru' | 'uz' | 'kz';
    } catch (e) {
        console.error("Ошибка при получении языка в FAQ:", e);
    }
    return 'ru'; // По умолчанию
}

// 1. Главное меню FAQ
faqHandler.callbackQuery(BotAction.FAQ, async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = await getUserLang(ctx.from.id);

    await ctx.editMessageText(t(lang, 'faq_title'), { 
        reply_markup: generateFaqKeyboard(lang), 
        parse_mode: "Markdown" 
    });
});

// 2. Что входит в стоимость?
faqHandler.callbackQuery("faq_included", async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = await getUserLang(ctx.from.id);

    await ctx.editMessageText(t(lang, 'faq_included_text'), { 
        reply_markup: generateBackKeyboard(lang), 
        parse_mode: "Markdown" 
    });
});

// 3. Сколько длится курс?
faqHandler.callbackQuery("faq_duration", async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = await getUserLang(ctx.from.id);

    await ctx.editMessageText(t(lang, 'faq_duration_text'), { 
        reply_markup: generateBackKeyboard(lang), 
        parse_mode: "Markdown" 
    });
});

// 4. С какими проблемами мы помогаем?
faqHandler.callbackQuery("faq_diseases", async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = await getUserLang(ctx.from.id);

    await ctx.editMessageText(t(lang, 'faq_diseases_text'), { 
        reply_markup: generateBackKeyboard(lang), 
        parse_mode: "Markdown" 
    });
});