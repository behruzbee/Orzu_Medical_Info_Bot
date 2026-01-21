import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { backKeyboard } from "../keyboards";

export const contactsHandler = new Composer<Context>();

contactsHandler.callbackQuery(BotAction.CONTACTS, async (ctx) => {
    await ctx.answerCallbackQuery();

    const text =
        `📍 **Наши филиалы и контакты:**\n\n` +
        `📞 **Насиба Бону (Чиназ)**\n` +
        `+998 97 712-17-51\n\n` +
        
        `📞 **Юнусабад (Ташкент)**\n` +
        `+998 88 547-41-44\n\n` +

        `📞 **Аккурган**\n` +
        `+998 88 540-87-47\n\n` +

        `📞 **Янги Базар**\n` +
        `+998 97 882-81-84\n\n` +

        `📞 **Зангиота**\n` +
        `+998 88 156-85-81\n\n` +

        `📞 **Паркент**\n` +
        `+998 88 569-97-98\n\n` +

        `📞 **Фотима Султон**\n` +
        `+998 88 737-41-42\n\n` +
        
        `🌐 [Наш сайт](https://orzumedical.uz)`;

    await ctx.reply(text, { reply_markup: backKeyboard, parse_mode: "Markdown" });
});