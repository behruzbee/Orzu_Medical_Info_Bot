import { Composer, Context } from "grammy";
import { mainKeyboard } from "../keyboards";

export const commandsHandler = new Composer<Context>();

commandsHandler.command("start", async (ctx) => {
    await ctx.reply(
        `👋 Здравствуйте, ${ctx.from?.first_name}!\n\n` +
        `Добро пожаловать в бота сети клиник **Orzu Medical**.\n` +
        `Мы занимаемся комплексным очищением организма и восстановлением здоровья естественным путем.\n\n` +
        `Выберите интересующий раздел:`,
        { reply_markup: mainKeyboard, parse_mode: "Markdown" }
    );
});

commandsHandler.callbackQuery("back_main", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("Выберите раздел:", { reply_markup: mainKeyboard });
});