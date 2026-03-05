import { Composer, Context } from "grammy";
import { BotAction } from "../types/enums";
import { backKeyboard, mainKeyboard } from "../keyboards";

// ⚠️ ВАЖНО: Вставьте сюда ваш ID в Telegram, чтобы получать заявки.
// Узнать свой ID можно в боте @userinfobot
const ADMIN_ID = 6049496733; 

export const contactsHandler = new Composer<Context>();

contactsHandler.callbackQuery(BotAction.CONTACTS, async (ctx) => {
    await ctx.answerCallbackQuery();

    const text =
        `🗺 **Адреса наших филиалов**\n` +
        `_Единый график работы: Пн-Сб с 8:30 до 17:00_\n\n` +

        `🏢 **Юнусабад (Ташкент)**\n` +
        `Юнусабадский район, 8-квартал, ул. Фарогат, 10-Б\n` +
        `📞 +998 (55) 508-10-10\n\n` +

        `🏢 **Фотима Султан**\n` +
        `Ташкентский район, МФГ Тутзор, ул. ТХАЙ Ёкаси, 14\n` +
        `📞 +998 (88) 737-41-42\n\n` +

        `🏢 **Зангиота**\n` +
        `Зангиатинский район, махалля Урта, ул. А.Темур, 180А\n` +
        `📞 +998 (55) 508-10-10\n\n` +

        `🏢 **Аккурган**\n` +
        `Аккурганский район, г. Аккурган, ул. Айбек, 5\n` +
        `📞 +998 (55) 508-10-10\n\n` +

        `🏢 **Паркент**\n` +
        `Паркентский район, махалля Каракалпак, ул. Шифокорлар, 100А\n` +
        `📞 +998 (55) 508-10-10\n\n` +

        `🏢 **Янгибазар**\n` +
        `Юкоричирчикский р-н, городок Янгибазар, махалля Иттифок, ул. Толарик, 34\n` +
        `📞 +998 (55) 508-10-10\n\n` +

        `🏢 **Насиба-Бону (Чиназ)**\n` +
        `Чиназский район, колхоз Эрназарова, махалля Маданият, ул. Самаркандская, 8\n` +
        `📞 +998 (55) 508-10-10`;

    await ctx.reply(text, { reply_markup: backKeyboard, parse_mode: "Markdown" });
});

// Обработчик кнопки "Связаться с оператором"
contactsHandler.callbackQuery("contact_operator", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
        `📞 **Связь с оператором**\n\n` +
        `Нажмите кнопку **"📱 Отправить мой номер"** внизу экрана, и мы перезвоним вам в течение 15 минут!\n\n` +
        `Или позвоните в главный офис:\n` +
        `🇺🇿 **+998 88 547-41-44**`,
        {
            reply_markup: {
                // Кнопка, запрашивающая контакт (работает только с keyboard, не inline)
                keyboard: [[{ text: "📱 Отправить мой номер", request_contact: true }]],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
            parse_mode: "Markdown"
        }
    );
});

// Ловим контакт пользователя
contactsHandler.on(":contact", async (ctx) => {
    const contact = ctx.message?.contact;
    const phone = contact?.phone_number;
    const name = contact?.first_name;
    const username = ctx.from?.username ? `@${ctx.from.username}` : "нет юзернейма";
    const userId = ctx.from?.id;

    // 1. Уведомление пользователю
    await ctx.reply(`✅ **Спасибо, ${name}!**\nВаша заявка принята. Оператор скоро свяжется с вами по номеру ${phone}.`, {
        reply_markup: { remove_keyboard: true } // Убираем кнопку отправки контакта
    });

    // 2. Возвращаем главное меню, чтобы он не скучал
    await ctx.reply("Главное меню:", { reply_markup: mainKeyboard });

    // 3. ОТПРАВКА ЗАЯВКИ АДМИНУ (ВАМ)
    if (ADMIN_ID && phone) {
        try {
            await ctx.api.sendMessage(
                ADMIN_ID, 
                `🔥 **НОВАЯ ЗАЯВКА!**\n\n` +
                `👤 Имя: **${name}**\n` +
                `📱 Телефон: **+${phone.replace('+', '')}**\n` +
                `🔗 Telegram: ${username}\n` +
                `🆔 ID: \`${userId}\``,
                { parse_mode: "Markdown" }
            );
        } catch (error) {
            console.error("Не удалось отправить сообщение админу:", error);
        }
    }
});