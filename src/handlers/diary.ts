import { Composer, InlineKeyboard } from "grammy";
import { UserModel } from "../db/models"; 
import { t } from "../locales";

export const diaryHandler = new Composer();

/**
 * Ультра-быстрая функция получения языка.
 * Ждем ответа от БД максимум 1 секунду, чтобы не повесить Vercel.
 */
async function getFastLang(userId: number): Promise<'ru' | 'uz' | 'kz'> {
    try {
        const user: any = await Promise.race([
            UserModel.findOne({ telegramId: userId }).lean(),
            new Promise((res) => setTimeout(() => res(null), 1000))
        ]);
        if (user && user.language) return user.language as 'ru' | 'uz' | 'kz';
    } catch (e) {
        console.error("FastLang Error:", e);
    }
    return 'ru'; // По умолчанию русский
}

// 1. ПОДПИСКА НА ДНЕВНИК
diaryHandler.callbackQuery("subscribe_diary", async (ctx) => {
    // Мгновенно убираем анимацию загрузки на кнопке
    await ctx.answerCallbackQuery().catch(() => {});
    
    const userId = ctx.from.id;
    const firstName = ctx.from.first_name || "Гость";
    const lang = await getFastLang(userId);

    // СНАЧАЛА обновляем интерфейс (пользователь сразу видит результат)
    const kb = new InlineKeyboard()
        .text(t(lang, 'btn_unsub_diary'), "unsubscribe_diary").row()
        .text(t(lang, 'btn_back_menu'), "back_main");

    await ctx.editMessageText(t(lang, 'diary_sub_success'), { 
        reply_markup: kb, 
        parse_mode: "Markdown" 
    }).catch(() => {});

    // ЗАТЕМ в фоновом режиме обновляем БД
    UserModel.updateOne(
        { telegramId: userId },
        { 
            $set: { 
                isSubscribed: true, 
                firstName: firstName 
            } 
        },
        { upsert: true }
    ).exec().catch(err => console.error("DB Update Error (Sub):", err));
});

// 2. ОТПИСКА ОТ ДНЕВНИКА
diaryHandler.callbackQuery("unsubscribe_diary", async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    
    const userId = ctx.from.id;
    const lang = await getFastLang(userId);

    // Мгновенно меняем текст
    await ctx.editMessageText(t(lang, 'diary_unsub_success'), { 
        reply_markup: new InlineKeyboard().text(t(lang, 'btn_back_menu'), "back_main"),
        parse_mode: "Markdown" 
    }).catch(() => {});

    // Обновляем БД в фоне
    UserModel.updateOne(
        { telegramId: userId },
        { $set: { isSubscribed: false } }
    ).exec().catch(err => console.error("DB Update Error (Unsub):", err));
});

// 3. КНОПКА ВЫПОЛНЕНИЯ ЗАДАНИЯ (из утренней рассылки)
diaryHandler.callbackQuery("diary_task_done", async (ctx) => {
    const lang = await getFastLang(ctx.from.id);

    // Всплывающее уведомление сверху экрана
    await ctx.answerCallbackQuery({
        text: t(lang, 'toast_task_done'),
        show_alert: false
    }).catch(() => {});

    // Меняем кнопку на "Выполнено"
    const successKb = new InlineKeyboard()
        .text(t(lang, 'btn_task_done'), "dummy_callback"); 

    try {
        await ctx.editMessageReplyMarkup({ reply_markup: successKb });
    } catch (error) {
        // Игнорируем, если сообщение уже удалено или изменено
    }
});

// 4. ЗАГЛУШКА (если нажали на уже выполненное задание)
diaryHandler.callbackQuery("dummy_callback", async (ctx) => {
    const lang = await getFastLang(ctx.from.id);
    await ctx.answerCallbackQuery(t(lang, 'toast_task_already_done')).catch(() => {});
});