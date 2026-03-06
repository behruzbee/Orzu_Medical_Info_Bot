// handlers/checkup.ts
import { Composer, Context, InlineKeyboard } from "grammy";
import { mainKeyboard } from "../keyboards";

export const checkupHandler = new Composer<Context>();

// Старт теста
checkupHandler.callbackQuery("start_checkup", async (ctx) => {
    await ctx.answerCallbackQuery();
    const kb = new InlineKeyboard()
        .text("Да, сплю плохо/не высыпаюсь", "chk_2_1").row()
        .text("Нет, сплю отлично", "chk_2_0");

    await ctx.editMessageText(
        "🩺 **Шаг 1 из 3: Как вы оцениваете свой сон?**\n\n" +
        "Часто ли вы просыпаетесь разбитым или страдаете бессонницей?",
        { reply_markup: kb, parse_mode: "Markdown" }
    );
});

// Второй вопрос
checkupHandler.callbackQuery(/chk_2_(\d+)/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const score = parseInt(ctx.match[1]); // Достаем баллы из предыдущего ответа
    
    const kb = new InlineKeyboard()
        .text("Часто болит спина/суставы", `chk_3_${score + 1}`).row()
        .text("Ничего не беспокоит", `chk_3_${score}`);

    await ctx.editMessageText(
        "🩺 **Шаг 2 из 3: Беспокоят ли вас боли?**\n\n" +
        "Чувствуете ли вы тяжесть в спине, шее или боли в суставах к концу дня?",
        { reply_markup: kb, parse_mode: "Markdown" }
    );
});

// Третий вопрос
checkupHandler.callbackQuery(/chk_3_(\d+)/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const score = parseInt(ctx.match[1]);
    
    const kb = new InlineKeyboard()
        .text("Постоянный стресс и усталость", `chk_res_${score + 1}`).row()
        .text("Я полон(на) энергии", `chk_res_${score}`);

    await ctx.editMessageText(
        "🩺 **Шаг 3 из 3: Уровень энергии**\n\n" +
        "Часто ли вы испытываете стресс, раздражительность или хроническую усталость?",
        { reply_markup: kb, parse_mode: "Markdown" }
    );
});

// Результат
checkupHandler.callbackQuery(/chk_res_(\d+)/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const score = parseInt(ctx.match[1]);
    let resultText = "";

    if (score >= 2) {
        resultText = "🚨 **Результат: Вашему организму срочно нужна перезагрузка!**\n\n" +
                     "Симптомы указывают на накопившуюся усталость и, возможно, зашлакованность организма. " +
                     "Курс детоксикации в **Orzu Medical** поможет вам вернуть глубокий сон, легкость в теле и энергию.\n\n" +
                     "💡 _Рекомендуем обратить внимание на филиалы с кедровыми бочками и релакс-процедурами (например, Паркент или Юнусабад)._";
    } else {
        resultText = "✅ **Результат: Вы в отличной форме!**\n\n" +
                     "Продолжайте заботиться о себе. Но помните, что профилактика — лучшее лечение. " +
                     "Приезжайте к нам просто отдохнуть на пару дней, подышать свежим воздухом и сходить на массаж!";
    }

    const kb = new InlineKeyboard()
        .text("📞 Проконсультироваться", "contact_operator").row()
        .text("🔙 В главное меню", "back_main");

    await ctx.editMessageText(resultText, { reply_markup: kb, parse_mode: "Markdown" });
});