import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { generateFaqKeyboard, generateBackKeyboard } from "../keyboards";
import { t } from "../locales";
import { UserModel } from "../db/models";

export const faqHandler = new Composer<Context>();

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

// 1. Главное меню FAQ
faqHandler.callbackQuery(BotAction.FAQ, async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const lang = await getFastLang(ctx.from.id);

  await ctx.editMessageText(t(lang, 'faq_title'), { 
    reply_markup: generateFaqKeyboard(lang), 
    parse_mode: "Markdown" 
  }).catch(() => {});
});

// 2. Что входит в стоимость?
faqHandler.callbackQuery("faq_included", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const lang = await getFastLang(ctx.from.id);

  await ctx.editMessageText(t(lang, 'faq_included_text'), { 
    reply_markup: generateBackKeyboard(lang), parse_mode: "Markdown" 
  }).catch(() => {});
});

// 3. Сколько длится курс?
faqHandler.callbackQuery("faq_duration", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const lang = await getFastLang(ctx.from.id);

  await ctx.editMessageText(t(lang, 'faq_duration_text'), { 
    reply_markup: generateBackKeyboard(lang), parse_mode: "Markdown" 
  }).catch(() => {});
});

// 4. С какими проблемами мы помогаем?
faqHandler.callbackQuery("faq_diseases", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const lang = await getFastLang(ctx.from.id);

  await ctx.editMessageText(t(lang, 'faq_diseases_text'), { 
    reply_markup: generateBackKeyboard(lang), parse_mode: "Markdown" 
  }).catch(() => {});
});