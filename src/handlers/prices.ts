import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { generateBackKeyboard } from "../keyboards";
import { t } from "../locales";
import { UserModel } from "../db/models";

export const pricesHandler = new Composer<Context>();

// Вспомогательная функция для получения языка пользователя
async function getUserLang(userId: number): Promise<'ru' | 'uz' | 'kz'> {
    try {
        const user = await UserModel.findOne({ telegramId: userId });
        if (user && user.language) return user.language as 'ru' | 'uz' | 'kz';
    } catch (e) {
        console.error("Ошибка при получении языка в prices:", e);
    }
    return 'ru'; // По умолчанию
}

pricesHandler.callbackQuery(BotAction.PRICES, async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = await getUserLang(ctx.from.id);

    // Берем переведенный текст цен из словаря
    const text = t(lang, 'prices_text');

    // Используем editMessageText для плавного обновления экрана
    await ctx.editMessageText(text, { 
        reply_markup: generateBackKeyboard(lang), 
        parse_mode: "Markdown" 
    });
});