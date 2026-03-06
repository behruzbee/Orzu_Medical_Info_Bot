import { Composer, Context, InlineKeyboard } from "grammy";
import { UserModel } from "../db/models";

export const diaryHandler = new Composer<Context>();

diaryHandler.callbackQuery("subscribe_diary", async (ctx) => {
    await ctx.answerCallbackQuery();
    
    const userId = ctx.from.id;
    const firstName = ctx.from.first_name;

    try {
        // Ищем пользователя или создаем нового (upsert)
        await UserModel.findOneAndUpdate(
            { telegramId: userId },
            { telegramId: userId, firstName: firstName, isSubscribed: true },
            { upsert: true, new: true }
        );

        const kb = new InlineKeyboard()
            .text("🔕 Отписаться", "unsubscribe_diary").row()
            .text("🔙 В главное меню", "back_main");

        await ctx.editMessageText(
            "✅ **Вы успешно подписались на Дневник Здоровья!**\n\n" +
            "Каждое утро я буду присылать вам короткие советы по питанию, напоминания выпить воды или сделать разминку. Заботьтесь о себе вместе с Orzu Medical 🌿",
            { reply_markup: kb, parse_mode: "Markdown" }
        );
    } catch (error) {
        console.error("Ошибка подписки:", error);
        await ctx.reply("❌ Произошла ошибка. Попробуйте позже.");
    }
});

diaryHandler.callbackQuery("unsubscribe_diary", async (ctx) => {
    await ctx.answerCallbackQuery();
    const userId = ctx.from.id;

    await UserModel.findOneAndUpdate(
        { telegramId: userId },
        { isSubscribed: false }
    );

    await ctx.editMessageText(
        "🔕 **Вы отписались от Дневника Здоровья.**\nВы больше не будете получать утренние советы.",
        { 
            reply_markup: new InlineKeyboard().text("🔙 В главное меню", "back_main"),
            parse_mode: "Markdown" 
        }
    );
});