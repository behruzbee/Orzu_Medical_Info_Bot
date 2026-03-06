import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { generateBackKeyboard } from "../keyboards";
import { t } from "../locales";
import { UserModel } from "../db/models"; // Проверьте путь

export const aboutHandler = new Composer<Context>();

// Ультра-быстрая функция: ждем БД максимум 1.5 секунды
async function getFastLang(userId: number): Promise<"ru" | "uz" | "kz"> {
  try {
    const user: any = await Promise.race([
      UserModel.findOne({ telegramId: userId }).lean(),
      new Promise((res) => setTimeout(() => res(null), 1500))
    ]);
    if (user && user.language) return user.language;
  } catch (e) {}
  return "ru"; // Если БД тупит, отдаем русский по умолчанию
}

aboutHandler.callbackQuery(BotAction.ABOUT, async (ctx) => {
  // 1. Мгновенно гасим часики!
  await ctx.answerCallbackQuery().catch(() => {});

  // 2. Быстро получаем язык
  const lang = await getFastLang(ctx.from.id);

  // 3. Рисуем интерфейс
  await ctx.editMessageText(t(lang, 'about_text'), {
    parse_mode: "Markdown",
    reply_markup: generateBackKeyboard(lang),
  }).catch((e) => console.error("Ошибка UI (about):", e));
});