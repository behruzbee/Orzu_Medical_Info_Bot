import { Composer, Context } from "grammy";
import { generateMainKeyboard, langKeyboard } from "../keyboards";
import { t } from "../locales";
import { UserModel } from "../db/models";

export const commandsHandler = new Composer<Context>();

// Умная функция с жестким таймером (максимум 3 секунды на ответ БД)
const withTimeout = <T>(promise: Promise<T>, ms = 3000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Таймаут базы данных")), ms)
    ),
  ]);
};

// Вспомогательная функция для безопасного получения данных пользователя
async function getUserData(userId?: number) {
  if (!userId) return { isSubscribed: false, lang: "ru" as const };

  try {
    // Ищем пользователя, но ждем не дольше 3 секунд!
    const user = await withTimeout(UserModel.findOne({ telegramId: userId }).lean());
    if (user && user.language) {
      return {
        isSubscribed: user.isSubscribed,
        lang: user.language as "ru" | "uz" | "kz",
      };
    }
  } catch (e) {
    console.error("⚠️ БД не ответила вовремя (getUserData):", e);
  }

  return { isSubscribed: false, lang: "ru" as const }; // Значения по умолчанию
}

// 1. Команда /start — Выбор языка
commandsHandler.command("start", async (ctx) => {
  await ctx.reply(t("ru", "choose_lang"), { reply_markup: langKeyboard });
});

// 2. Обработка нажатия на кнопку языка (🇷🇺, 🇺🇿, 🇰🇿)
commandsHandler.callbackQuery(/set_lang_(ru|uz|kz)/, async (ctx) => {
  // 1. СРАЗУ отвечаем Телеграму
  await ctx.answerCallbackQuery().catch(() => {});

  const selectedLang = ctx.match[1] as "ru" | "uz" | "kz";
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name || "Гость"; 

  let isSubscribed = false;

  try {
    // Записываем в БД, но даем на это максимум 3 секунды!
    const dbQuery = UserModel.findOneAndUpdate(
      { telegramId: userId },
      { telegramId: userId, firstName: firstName, language: selectedLang },
      { upsert: true, new: true },
    ).lean();

    const user = await withTimeout(dbQuery);
    if (user) {
        isSubscribed = user.isSubscribed;
    }
  } catch (error) {
    console.error("⚠️ БД не ответила вовремя (set_lang):", error);
    // Бот пойдет дальше даже если БД "отвалилась"!
  }

  // 3. Формируем текст и клавиатуру
  const welcomeText = t(selectedLang, "welcome", { name: firstName });

  // 4. Обновляем сообщение
  await ctx.editMessageText(welcomeText, {
    reply_markup: generateMainKeyboard(isSubscribed, selectedLang),
    parse_mode: "Markdown",
  }).catch((e) => console.error("❌ Ошибка при отрисовке меню:", e));
});

// 3. Возврат в главное меню по кнопке "Назад"
commandsHandler.callbackQuery("back_main", async (ctx) => {
  // 👇 ЗДЕСЬ БЫЛА ОШИБКА: Добавили catch(() => {}), чтобы кнопка Назад не падала!
  await ctx.answerCallbackQuery().catch(() => {});

  // Узнаем, какой язык и статус подписки у пользователя (максимум 3 сек)
  const userData = await getUserData(ctx.from.id);

  const welcomeText = t(userData.lang, "welcome", {
    name: ctx.from.first_name || "Гость",
  });

  // Отрисовываем меню на правильном языке
  await ctx.editMessageText(welcomeText, {
    reply_markup: generateMainKeyboard(userData.isSubscribed, userData.lang),
    parse_mode: "Markdown",
  }).catch((e) => console.error("❌ Ошибка возврата в меню:", e));
});