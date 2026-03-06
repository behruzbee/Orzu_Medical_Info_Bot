import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { generateBackKeyboard, generateMainKeyboard } from "../keyboards";
import { t } from "../locales";
import { UserModel } from "../db/models";

// ⚠️ ВАЖНО: Вставьте сюда ваш ID в Telegram
const ADMIN_ID = 6049496733; 

export const contactsHandler = new Composer<Context>();

// Вспомогательная функция для безопасного получения данных пользователя
async function getUserData(userId?: number) {
    if (!userId) return { isSubscribed: false, lang: 'ru' as const };
    try {
        const user = await UserModel.findOne({ telegramId: userId });
        if (user && user.language) {
            return { isSubscribed: user.isSubscribed, lang: user.language as 'ru' | 'uz' | 'kz' };
        }
    } catch (e) { console.error(e); }
    return { isSubscribed: false, lang: 'ru' as const };
}

// 1. Показываем адреса
contactsHandler.callbackQuery(BotAction.CONTACTS, async (ctx) => {
    await ctx.answerCallbackQuery();
    const { lang } = await getUserData(ctx.from.id);

    await ctx.editMessageText(t(lang, 'contacts_text'), { 
        reply_markup: generateBackKeyboard(lang), 
        parse_mode: "Markdown" 
    });
});

// 2. Обработчик кнопки "Связаться с оператором"
contactsHandler.callbackQuery("contact_operator", async (ctx) => {
    await ctx.answerCallbackQuery();
    const { lang } = await getUserData(ctx.from.id);

    const btnText = t(lang, 'btn_send_contact');
    const msgText = t(lang, 'operator_text', { btn_text: btnText });

    await ctx.reply(msgText, {
        reply_markup: {
            // Кнопка, запрашивающая контакт (native keyboard)
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

    const { isSubscribed, lang } = await getUserData(userId);

    // 1. Уведомление пользователю
    await ctx.reply(t(lang, 'contact_received', { name, phone: phone || '' }), {
        reply_markup: { remove_keyboard: true } // Убираем native кнопку
    });

    // 2. Возвращаем главное меню на правильном языке
    await ctx.reply(t(lang, 'main_menu_label'), { 
        reply_markup: generateMainKeyboard(isSubscribed, lang) 
    });

    // 3. ОТПРАВКА ЗАЯВКИ АДМИНУ (На русском)
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