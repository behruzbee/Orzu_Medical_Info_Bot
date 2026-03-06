import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { generateBackKeyboard } from "../keyboards";
import { t } from "../locales";
import { UserModel } from "../db/models";

export const aboutHandler = new Composer<Context>();

aboutHandler.callbackQuery(BotAction.ABOUT, async (ctx) => {
  // 👇 1. СРАЗУ отвечаем Телеграму
  await ctx.answerCallbackQuery().catch(() => {});

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
  }).catch((e) => console.error("Ошибка обновления сообщения:", e));
  // Добавили catch и сюда, чтобы если Телеграм удалит старое сообщение, бот не упал
});