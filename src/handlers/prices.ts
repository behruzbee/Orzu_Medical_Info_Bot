import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { generateBackKeyboard } from "../keyboards";
import { t } from "../locales";
import { UserModel } from "../db/models";

export const pricesHandler = new Composer<Context>();

async function getFastLang(userId: number): Promise<"ru" | "uz" | "kz"> {
  try {
    const user: any = await Promise.race([
      UserModel.findOne({ telegramId: userId }).lean(),
      new Promise((res) => setTimeout(() => res(null), 1500))
    ]);
    if (user && user.language) return user.language;
  } catch (e) {}
  return "ru";
}

pricesHandler.callbackQuery(BotAction.PRICES, async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  
  const lang = await getFastLang(ctx.from.id);

  await ctx.editMessageText(t(lang, 'prices_text'), { 
    reply_markup: generateBackKeyboard(lang), 
    parse_mode: "Markdown" 
  }).catch((e) => console.error("Ошибка UI (prices):", e));
});