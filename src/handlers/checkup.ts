import { Composer, Context, InlineKeyboard } from "grammy";
import { t } from "../locales";
import { UserModel } from "../db/models";

export const checkupHandler = new Composer<Context>();

// Ультра-быстрая функция получения языка
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

// Старт теста (Вопрос 1)
checkupHandler.callbackQuery("start_checkup", async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    const lang = await getFastLang(ctx.from.id);

    const kb = new InlineKeyboard()
        .text(t(lang, 'chk_a1_1'), "chk_2_1").row()
        .text(t(lang, 'chk_a1_2'), "chk_2_0");

    await ctx.editMessageText(t(lang, 'chk_q1'), { reply_markup: kb, parse_mode: "Markdown" }).catch(()=>{});
});

// Второй вопрос
checkupHandler.callbackQuery(/chk_2_(\d+)/, async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    const lang = await getFastLang(ctx.from.id);
    const score = parseInt(ctx.match[1]); 
    
    const kb = new InlineKeyboard()
        .text(t(lang, 'chk_a2_1'), `chk_3_${score + 1}`).row()
        .text(t(lang, 'chk_a2_2'), `chk_3_${score}`);

    await ctx.editMessageText(t(lang, 'chk_q2'), { reply_markup: kb, parse_mode: "Markdown" }).catch(()=>{});
});

// Третий вопрос
checkupHandler.callbackQuery(/chk_3_(\d+)/, async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    const lang = await getFastLang(ctx.from.id);
    const score = parseInt(ctx.match[1]);
    
    const kb = new InlineKeyboard()
        .text(t(lang, 'chk_a3_1'), `chk_res_${score + 1}`).row()
        .text(t(lang, 'chk_a3_2'), `chk_res_${score}`);

    await ctx.editMessageText(t(lang, 'chk_q3'), { reply_markup: kb, parse_mode: "Markdown" }).catch(()=>{});
});

// Результат
checkupHandler.callbackQuery(/chk_res_(\d+)/, async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    const lang = await getFastLang(ctx.from.id);
    const score = parseInt(ctx.match[1]);

    const resultText = score >= 2 ? t(lang, 'chk_res_bad') : t(lang, 'chk_res_good');

    const kb = new InlineKeyboard()
        .text(t(lang, 'btn_consult'), "contact_operator").row()
        .text(t(lang, 'btn_back_menu'), "back_main");

    await ctx.editMessageText(resultText, { reply_markup: kb, parse_mode: "Markdown" }).catch(()=>{});
});