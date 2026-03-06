import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { generateBackKeyboard } from "../keyboards";
import { t } from "../locales"; // Путь до словаря
import { UserModel } from "../db/models";

export const aboutHandler = new Composer<Context>();

aboutHandler.callbackQuery(BotAction.ABOUT, async (ctx) => {
  await ctx.answerCallbackQuery();

  const userId = ctx.from.id;
  let lang: 'ru' | 'uz' | 'kz' = 'ru';

  try {
      const user = await UserModel.findOne({ telegramId: userId });
      if (user && user.language) {
          lang = user.language as 'ru' | 'uz' | 'kz';
      }
  } catch (error) {
      console.error("Ошибка при получении языка в about:", error);
  }

  const text = t(lang, 'about_text');

  await ctx.editMessageText(text, {
    parse_mode: "Markdown",
    reply_markup: generateBackKeyboard(lang),
  });
});