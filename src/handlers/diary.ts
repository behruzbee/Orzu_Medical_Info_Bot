import { Composer, Context, InlineKeyboard } from "grammy";
import { UserModel } from "../db/models"; // Проверьте правильность пути к вашей БД
import { t } from "../locales";

export const diaryHandler = new Composer<Context>();

async function getUserLang(userId: number): Promise<'ru' | 'uz' | 'kz'> {
    try {
        const user = await UserModel.findOne({ telegramId: userId });
        if (user && user.language) return user.language as 'ru' | 'uz' | 'kz';
    } catch (e) {
        console.error("Ошибка при получении языка в diary:", e);
    }
    return 'ru'; // По умолчанию
}

// 1. Подписка
diaryHandler.callbackQuery("subscribe_diary", async (ctx) => {
    await ctx.answerCallbackQuery();
    
    const userId = ctx.from.id;
    const firstName = ctx.from.first_name;
    const lang = await getUserLang(userId);

    try {
        await UserModel.findOneAndUpdate(
            { telegramId: userId },
            { telegramId: userId, firstName: firstName, isSubscribed: true },
            { upsert: true, new: true }
        );

        const kb = new InlineKeyboard()
            .text(t(lang, 'btn_unsub_diary'), "unsubscribe_diary").row()
            .text(t(lang, 'btn_back_menu'), "back_main");

        await ctx.editMessageText(t(lang, 'diary_sub_success'), { 
            reply_markup: kb, 
            parse_mode: "Markdown" 
        });
    } catch (error) {
        console.error("Ошибка подписки:", error);
        await ctx.reply(t(lang, 'diary_sub_error'));
    }
});

// 2. Отписка
diaryHandler.callbackQuery("unsubscribe_diary", async (ctx) => {
    await ctx.answerCallbackQuery();
    
    const userId = ctx.from.id;
    const lang = await getUserLang(userId);

    await UserModel.findOneAndUpdate(
        { telegramId: userId },
        { isSubscribed: false }
    );

    await ctx.editMessageText(t(lang, 'diary_unsub_success'), { 
        reply_markup: new InlineKeyboard().text(t(lang, 'btn_back_menu'), "back_main"),
        parse_mode: "Markdown" 
    });
});

diaryHandler.callbackQuery("diary_task_done", async (ctx) => {
    const lang = await getUserLang(ctx.from.id);

    await ctx.answerCallbackQuery({
        text: t(lang, 'toast_task_done'),
        show_alert: false
    });

    const successKb = new InlineKeyboard()
        .text(t(lang, 'btn_task_done'), "dummy_callback"); 

    try {
        await ctx.editMessageReplyMarkup({ reply_markup: successKb });
    } catch (error) {
    }
});

// 4. Заглушка (когда задание уже выполнено)
diaryHandler.callbackQuery("dummy_callback", async (ctx) => {
    const lang = await getUserLang(ctx.from.id);
    await ctx.answerCallbackQuery(t(lang, 'toast_task_already_done'));
});