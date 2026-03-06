import { Composer, Context } from "grammy";
import { generateMainKeyboard, langKeyboard } from "../keyboards";
import { t } from "../locales"; // Укажите правильный путь к словарю
import { UserModel } from "../db/models";

export const commandsHandler = new Composer<Context>();

// Вспомогательная функция для безопасного получения данных пользователя
async function getUserData(userId?: number) {
    if (!userId) return { isSubscribed: false, lang: 'ru' as const };
    
    try {
        const user = await UserModel.findOne({ telegramId: userId });
        if (user && user.language) {
            return { 
                isSubscribed: user.isSubscribed, 
                lang: user.language as 'ru' | 'uz' | 'kz' 
            };
        }
    } catch (e) { 
        console.error("Ошибка при получении данных пользователя:", e); 
    }
    
    return { isSubscribed: false, lang: 'ru' as const }; // Значения по умолчанию
}

// 1. Команда /start — Выбор языка
commandsHandler.command("start", async (ctx) => {
    // При старте выводим текст с просьбой выбрать язык (ключ choose_lang у нас на 3 языках сразу)
    await ctx.reply(t('ru', 'choose_lang'), { reply_markup: langKeyboard });
});

// 2. Обработка нажатия на кнопку языка (🇷🇺, 🇺🇿, 🇰🇿)
commandsHandler.callbackQuery(/set_lang_(ru|uz|kz)/, async (ctx) => {
    await ctx.answerCallbackQuery();
    
    const selectedLang = ctx.match[1] as 'ru' | 'uz' | 'kz';
    const userId = ctx.from.id;
    const firstName = ctx.from.first_name;

    let isSubscribed = false;

    try {
        // Ищем пользователя или создаем нового, попутно сохраняя выбранный язык
        const user = await UserModel.findOneAndUpdate(
            { telegramId: userId },
            { telegramId: userId, firstName: firstName, language: selectedLang },
            { upsert: true, new: true }
        );
        isSubscribed = user.isSubscribed;
    } catch (error) {
        console.error("Ошибка при сохранении языка:", error);
    }

    // Достаем приветственный текст с именем пользователя
    const welcomeText = t(selectedLang, 'welcome', { name: firstName });
    
    // Заменяем сообщение с выбором языка на Главное меню
    await ctx.editMessageText(welcomeText, { 
        reply_markup: generateMainKeyboard(isSubscribed, selectedLang), 
        parse_mode: "Markdown" 
    });
});

// 3. Возврат в главное меню по кнопке "Назад"
commandsHandler.callbackQuery("back_main", async (ctx) => {
    await ctx.answerCallbackQuery();
    
    // Узнаем, какой язык и статус подписки у пользователя
    const userData = await getUserData(ctx.from.id);
    
    const welcomeText = t(userData.lang, 'welcome', { name: ctx.from.first_name });
    
    // Отрисовываем меню на правильном языке
    await ctx.editMessageText(welcomeText, { 
        reply_markup: generateMainKeyboard(userData.isSubscribed, userData.lang),
        parse_mode: "Markdown"
    });
});