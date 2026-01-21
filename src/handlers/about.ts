import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { backKeyboard } from "../keyboards";

export const aboutHandler = new Composer<Context>();

aboutHandler.callbackQuery(BotAction.ABOUT, async (ctx) => {
  await ctx.answerCallbackQuery();

  const text =
    `🏥 **О компании Orzu Medical**\n\n` +
    `Наша история началась в **1997 году** с филиала «Насиба-Бону». \n` +
    `Основатели: **Рустамова Арзигул Нурмахановна** (врач с 50-летним стажем) и **Адилбеков Баходир Торкисович**.\n\n` +
    `✅ **Наша методика:**\n` +
    `Мы не просто лечим симптомы, а проводим **комплексное очищение организма** (кишечник, печень, желчный пузырь, сосуды) от шлаков и солей.\n\n` +
    `🔬 **Основные процедуры:**\n` +
    `— Лечебное голодание и диетотерапия\n` +
    `— Фитотерапия (травы по рецептам Ибн Сины)\n` +
    `— Озонотерапия и Лазеротерапия\n` +
    `— Апитерапия (пчелиный яд) и Гирудотерапия\n` +
    `— Соляные пещеры и кедровые бочки\n\n` +
    `📖 Подробнее в нашей книге: [Ссылка](https://orzu-medical-electron-book.vercel.app/)`;

  await ctx.reply(text, {
    parse_mode: "Markdown",
    reply_markup: backKeyboard,
  });
});
