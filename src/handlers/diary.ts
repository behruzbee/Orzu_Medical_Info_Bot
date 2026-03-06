import { Composer, Context, InlineKeyboard } from "grammy";
import { UserModel } from "../db/models"; 
import { t } from "../locales";

export const diaryHandler = new Composer<Context>();

async function getFastLang(userId: number): Promise<'ru' | 'uz' | 'kz'> {
    try {
        const user: any = await Promise.race([
            UserModel.findOne({ telegramId: userId }).lean(),
            new Promise((res) => setTimeout(() => res(null), 1500))
        ]);
        if (user && user.language) return user.language;
    } catch (e) {}
    return 'ru';
}

// 1. Подписка
diaryHandler.callbackQuery("subscribe_diary", async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    
    const userId = ctx.from.id;
    const firstName = ctx.from.first_name || "Гость";
    const lang = await getFastLang(userId);

    try {
        // Тут ставим maxTimeMS чтобы БД не висела
        await UserModel.findOneAndUpdate(
            { telegramId: userId },
            { telegramId: userId, firstName: firstName, isSubscribed: true },
            { upsert: true, new: true }
        ).maxTimeMS(2000);

        const kb = new InlineKeyboard()
            .text(t(lang, 'btn_unsub_diary'), "unsubscribe_diary").row()
            .text(t(lang, 'btn_back_menu'), "back_main");

        await ctx.editMessageText(t(lang, 'diary_sub_success'), { 
            reply_markup: kb, 
            parse_mode: "Markdown" 
        }).catch(()=>{});
    } catch (error) {
        await ctx.reply(t(lang, 'diary_sub_error'));
    }
});

// 2. Отписка
diaryHandler.callbackQuery("unsubscribe_diary", async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    
    const userId = ctx.from.id;
    const lang = await getFastLang(userId);

    try {
        await UserModel.findOneAndUpdate(
            { telegramId: userId },
            { isSubscribed: false }
        ).maxTimeMS(2000);
    } catch(e) {}

    await ctx.editMessageText(t(lang, 'diary_unsub_success'), { 
        reply_markup: new InlineKeyboard().text(t(lang, 'btn_back_menu'), "back_main"),
        parse_mode: "Markdown" 
    }).catch(()=>{});
});

// 3. Выполнение задания
diaryHandler.callbackQuery("diary_task_done", async (ctx) => {
    // Всплывашка!
    const lang = await getFastLang(ctx.from.id);
    await ctx.answerCallbackQuery({
        text: t(lang, 'toast_task_done'),
        show_alert: false
    }).catch(() => {});

    const successKb = new InlineKeyboard()
        .text(t(lang, 'btn_task_done'), "dummy_callback"); 

    try {
        await ctx.editMessageReplyMarkup({ reply_markup: successKb });
    } catch (error) {}
});

// 4. Заглушка
diaryHandler.callbackQuery("dummy_callback", async (ctx) => {
    const lang = await getFastLang(ctx.from.id);
    await ctx.answerCallbackQuery(t(lang, 'toast_task_already_done')).catch(()=>{});
});