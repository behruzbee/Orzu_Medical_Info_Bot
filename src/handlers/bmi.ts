// handlers/bmi.ts
import { Composer, Context, InlineKeyboard } from "grammy";

export const bmiHandler = new Composer<Context>();

// Простейшее хранилище состояний в памяти
// Ключ: ID пользователя, Значение: шаг (вес/рост) и сохраненный вес
const userSteps = new Map<number, { step: string, weight?: number }>();

bmiHandler.callbackQuery("start_bmi", async (ctx) => {
    await ctx.answerCallbackQuery();
    const userId = ctx.from.id;
    
    userSteps.set(userId, { step: "WAITING_WEIGHT" });

    await ctx.reply(
        "⚖️ **Калькулятор Индекса Массы Тела (ИМТ)**\n\n" +
        "Давайте проверим, в норме ли ваш вес. Отправьте мне ваш **текущий вес в килограммах** (например: 75):",
        { parse_mode: "Markdown" }
    );
});

// Обработка текстовых сообщений для ИМТ
bmiHandler.on("message:text", async (ctx, next) => {
    const userId = ctx.from.id;
    const state = userSteps.get(userId);

    // Если пользователь не в процессе калькулятора, пропускаем дальше
    if (!state) return next();

    const input = parseFloat(ctx.message.text.replace(',', '.'));

    if (isNaN(input) || input <= 0) {
        return ctx.reply("⚠️ Пожалуйста, введите корректное число (например: 75 или 170).");
    }

    if (state.step === "WAITING_WEIGHT") {
        if (input < 30 || input > 300) return ctx.reply("⚠️ Указан нереалистичный вес. Попробуйте снова:");
        
        userSteps.set(userId, { step: "WAITING_HEIGHT", weight: input });
        await ctx.reply("✅ Принято. Теперь отправьте ваш **рост в сантиметрах** (например: 175):");
        
    } else if (state.step === "WAITING_HEIGHT") {
        if (input < 100 || input > 250) return ctx.reply("⚠️ Указан нереалистичный рост. Попробуйте снова (в сантиметрах):");

        const weight = state.weight!;
        const heightMeters = input / 100;
        
        // Формула ИМТ: вес / (рост в метрах в квадрате)
        const bmi = +(weight / (heightMeters * heightMeters)).toFixed(1);
        
        // Очищаем состояние пользователя
        userSteps.delete(userId);

        let verdict = "";
        let advice = "";

        if (bmi < 18.5) {
            verdict = "Недостаточная масса тела 📉";
            advice = "Вам может не хватать нутриентов. В клинике мы поможем нормализовать работу ЖКТ для лучшего усвоения пищи.";
        } else if (bmi >= 18.5 && bmi < 24.9) {
            verdict = "Норма! Вы молодец 🍏";
            advice = "Поддерживайте форму! Детокс 1-2 раза в год поможет сохранить этот результат надолго.";
        } else if (bmi >= 25 && bmi < 29.9) {
            verdict = "Избыточная масса тела ⚠️";
            advice = "Пора обратить внимание на питание. Лечебное голодание и очищение печени в нашей клинике помогут запустить метаболизм.";
        } else {
            verdict = "Ожирение 🚨";
            advice = "Лишний вес — сильная нагрузка на суставы и сердце. В Orzu Medical мы комплексно лечим жировой гепатоз печени и помогаем безопасно снизить вес под контролем врачей.";
        }

        const kb = new InlineKeyboard()
            .text("📞 Узнать о программах похудения", "contact_operator").row()
            .text("🔙 В меню", "back_main");

        // Прикрепляем диаграмму для наглядности (бот сам подгрузит картинку)
        await ctx.reply(
            `📊 **Ваш ИМТ: ${bmi}**\n` +
            `**Статус:** ${verdict}\n\n` +
            `👨‍⚕️ **Рекомендация:** ${advice}\n\n` +
            ``, 
            { reply_markup: kb, parse_mode: "Markdown" }
        );
    }
});