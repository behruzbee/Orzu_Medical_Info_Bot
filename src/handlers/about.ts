import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { backKeyboard } from "../keyboards";

export const aboutHandler = new Composer<Context>();

aboutHandler.callbackQuery(BotAction.ABOUT, async (ctx) => {
  await ctx.answerCallbackQuery();

  const text =
    `🏥 **Orzu Medical — Возвращаем здоровье без таблеток**\n\n` +
    `Мы работаем с **1997 года** и за это время помогли тысячам людей вернуть радость полноценной жизни. У истоков клиники стоят врач с 50-летним стажем Рустамова Арзигул и Адилбеков Баходир.\n\n` +
    `🌿 **В чем наш секрет?**\n` +
    `Мы не "глушим" симптомы. Мы устраняем корень болезней через **глубокое очищение организма** (печени, кишечника, сосудов) от накопившихся токсинов, шлаков и солей.\n\n` +
    `✨ **Как мы лечим:**\n` +
    `• Лечебное голодание и персональная диета\n` +
    `• Древние рецепты фитотерапии Ибн Сины\n` +
    `• Озоно- и лазеротерапия\n` +
    `• Гирудотерапия и лечение пчелиным ядом\n` +
    `• Релакс: кедровые бочки и соляные пещеры\n\n` +
    `📖 Узнайте больше в нашей книге: [Читать онлайн](https://orzu-medical-electron-book.vercel.app/)`;

  await ctx.reply(text, {
    parse_mode: "Markdown",
    reply_markup: backKeyboard,
  });
});