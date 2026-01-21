import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { faqKeyboard, backKeyboard } from "../keyboards";

export const faqHandler = new Composer<Context>();

faqHandler.callbackQuery(BotAction.FAQ, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("❓ Выберите вопрос:", { reply_markup: faqKeyboard });
});

faqHandler.callbackQuery("faq_duration", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
        "📅 **Курс лечения длится 10 дней.**\n\n" +
        "За это время проводится 3 этапа очистки печени, полное очищение кишечника и восстановление кровообращения.",
        { reply_markup: backKeyboard, parse_mode: "Markdown" }
    );
});

faqHandler.callbackQuery("faq_diseases", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
        "💊 **Мы помогаем при следующих заболеваниях:**\n\n" +
        "✅ Сахарный диабет 2 типа (без инсулина)\n" +
        "✅ Гипертония (высокое давление)\n" +
        "✅ Ожирение печени, холецистит\n" +
        "✅ Аллергии и кожные заболевания\n" +
        "✅ Грыжи, остеохондроз, артриты\n\n" +
        "Мы устраняем **причину** болезни — зашлакованность организма.",
        { reply_markup: backKeyboard, parse_mode: "Markdown" }
    );
});