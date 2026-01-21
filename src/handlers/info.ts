import { Composer, Context } from "grammy";

export const infoHandler = new Composer<Context>();

infoHandler.callbackQuery("about", async (ctx) => {
    await ctx.answerCallbackQuery(); // Обязательно отвечаем телеграму
    await ctx.reply("🏢 Мы IT-компания, пишем чистый код на TS.");
});

infoHandler.callbackQuery("contacts", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("📞 Телефон: +998 90 123 45 67\n📍 Ташкент, Ц-1");
});