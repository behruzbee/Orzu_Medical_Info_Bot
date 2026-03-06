import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { generateBackKeyboard, generateMainKeyboard } from "../keyboards";
import { t } from "../locales";
import { UserModel } from "../db/models";

// ⚠️ ВАЖНО: Вставьте сюда ваш ID в Telegram
const ADMIN_ID = 6049496733; 

export const contactsHandler = new Composer<Context>();

// Умная функция с жестким таймером
const withTimeout = <T>(promise: Promise<T>, ms = 1500): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Таймаут")), ms)
      ),
    ]);
  };

// Вспомогательная функция для безопасного получения данных пользователя
async function getUserData(userId?: number) {
    if (!userId) return { isSubscribed: false, lang: 'ru' as const };
    try {
        const user: any = await withTimeout(UserModel.findOne({ telegramId: userId }).lean());
        if (user && user.language) {
            return { isSubscribed: user.isSubscribed, lang: user.language as 'ru' | 'uz' | 'kz' };
        }
    } catch (e) {}
    return { isSubscribed: false, lang: 'ru' as const };
}

// 1. Показываем адреса
contactsHandler.callbackQuery(BotAction.CONTACTS, async (ctx) => {
    // СРАЗУ гасим часики
    await ctx.answerCallbackQuery().catch(() => {});
    const { lang } = await getUserData(ctx.from.id);

    await ctx.editMessageText(t(lang, 'contacts_text'), { 
        reply_markup: generateBackKeyboard(lang), 
        parse_mode: "Markdown" 
    }).catch(() => {});
});

// 2. Обработчик кнопки "Связаться с оператором"
contactsHandler.callbackQuery("contact_operator", async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    const { lang } = await getUserData(ctx.from.id);

    const btnText = t(lang, 'btn_send_contact');
    const msgText = t(lang, 'operator_text', { btn_text: btnText });

    await ctx.reply(msgText, {
        reply_markup: {
            keyboard: [[{ text: btnText, request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
        parse_mode: "Markdown"
    });
});

// 3. Ловим отправленный контакт пользователя
contactsHandler.on(":contact", async (ctx) => {
    const contact = ctx.message?.contact;
    const phone = contact?.phone_number;
    const name = contact?.first_name || "Гость";
    const username = ctx.from?.username ? `@${ctx.from.username}` : "нет юзернейма";
    const userId = ctx.from?.id;

    // Тут можно подождать БД чуть дольше (3 сек), так как юзер ввел текст, а не нажал инлайн кнопку
    const { isSubscribed, lang } = await getUserData(userId);

    // 1. Уведомление пользователю
    await ctx.reply(t(lang, 'contact_received', { name, phone: phone || '' }), {
        reply_markup: { remove_keyboard: true }
    });

    // 2. Возвращаем главное меню
    await ctx.reply(t(lang, 'main_menu_label'), { 
        reply_markup: generateMainKeyboard(isSubscribed, lang) 
    });

    // 3. ОТПРАВКА ЗАЯВКИ АДМИНУ
    if (ADMIN_ID && phone) {
        try {
            await ctx.api.sendMessage(
                ADMIN_ID, 
                `🔥 **НОВАЯ ЗАЯВКА (из Бота)!**\n\n` +
                `👤 Имя: **${name}**\n` +
                `📱 Телефон: **+${phone.replace('+', '')}**\n` +
                `🔗 Telegram: ${username}\n` +
                `🆔 ID: \`${userId}\`\n` +
                `🌐 Язык: ${lang.toUpperCase()}`,
                { parse_mode: "Markdown" }
            );
        } catch (error) {
            console.error("Не удалось отправить сообщение админу:", error);
        }
    }
});