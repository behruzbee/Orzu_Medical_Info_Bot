import { Composer, Context, InlineKeyboard } from "grammy";
import { t } from "../locales";
import { UserModel } from "../db/models";

export const bmiHandler = new Composer<Context>();

type BmiState = {
    step: string;
    weight?: number;
    lang: 'ru' | 'uz' | 'kz';
};

const userSteps = new Map<number, BmiState>();

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

bmiHandler.callbackQuery("start_bmi", async (ctx) => {
    // 1. СРАЗУ гасим часики!
    await ctx.answerCallbackQuery().catch(() => {});
    
    const userId = ctx.from.id;
    // 2. Быстро получаем язык (максимум 1.5 сек)
    const lang = await getFastLang(userId);
    
    userSteps.set(userId, { step: "WAITING_WEIGHT", lang });

    await ctx.reply(t(lang, 'bmi_start_title'), { parse_mode: "Markdown" });
});

bmiHandler.on("message:text", async (ctx, next) => {
    const userId = ctx.from.id;
    const state = userSteps.get(userId);

    if (!state) return next();

    const lang = state.lang;
    const input = parseFloat(ctx.message.text.replace(',', '.'));

    if (isNaN(input) || input <= 0) {
        return ctx.reply(t(lang, 'bmi_err_num'));
    }

    if (state.step === "WAITING_WEIGHT") {
        if (input < 30 || input > 300) return ctx.reply(t(lang, 'bmi_err_weight'));
        
        userSteps.set(userId, { step: "WAITING_HEIGHT", weight: input, lang });
        await ctx.reply(t(lang, 'bmi_ask_height'), { parse_mode: "Markdown" });
        
    } else if (state.step === "WAITING_HEIGHT") {
        if (input < 100 || input > 250) return ctx.reply(t(lang, 'bmi_err_height'));

        const weight = state.weight!;
        const heightMeters = input / 100;
        
        const bmi = +(weight / (heightMeters * heightMeters)).toFixed(1);
        
        userSteps.delete(userId);

        let verdictKey: "bmi_verdict_under" | "bmi_verdict_normal" | "bmi_verdict_over" | "bmi_verdict_obese";
        let adviceKey: "bmi_advice_under" | "bmi_advice_normal" | "bmi_advice_over" | "bmi_advice_obese";

        if (bmi < 18.5) {
            verdictKey = "bmi_verdict_under";
            adviceKey = "bmi_advice_under";
        } else if (bmi >= 18.5 && bmi < 24.9) {
            verdictKey = "bmi_verdict_normal";
            adviceKey = "bmi_advice_normal";
        } else if (bmi >= 25 && bmi < 29.9) {
            verdictKey = "bmi_verdict_over";
            adviceKey = "bmi_advice_over";
        } else {
            verdictKey = "bmi_verdict_obese";
            adviceKey = "bmi_advice_obese";
        }

        const verdict = t(lang, verdictKey);
        const advice = t(lang, adviceKey);

        const kb = new InlineKeyboard()
            .text(t(lang, 'btn_weight_programs'), "contact_operator").row()
            .text(t(lang, 'btn_back_menu'), "back_main");

        const resultText = t(lang, 'bmi_result', {
            bmi: bmi.toString(),
            verdict: verdict,
            advice: advice
        });

        // Наглядная шкала поможет пользователю лучше понять свой результат
        await ctx.reply(
            `${resultText}\n\n

[Image of Body Mass Index chart categories]
`, 
            { reply_markup: kb, parse_mode: "Markdown" }
        );
    }
});