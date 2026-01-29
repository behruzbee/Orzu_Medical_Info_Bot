import { InlineKeyboard } from "grammy";
import { BotAction } from "../types/enums";

// Главное меню
export const mainKeyboard = new InlineKeyboard()
    .text("🏥 О клинике и Методика", BotAction.ABOUT).row()
    .text("💰 Актуальный Прайс-лист", BotAction.PRICES).row() // Обновили название
    .text("📍 Филиалы и Адреса", BotAction.CONTACTS).row()
    .text("❓ Частые вопросы и Услуги", BotAction.FAQ).row()
    .text("📞 Связаться с оператором", "contact_operator").row() // Кнопка высокой конверсии
    .url("🌐 Наш сайт", "https://orzumedical.uz")
    .url("📚 Читать книгу онлайн", "https://orzu-medical-electron-book.vercel.app/");

// Меню FAQ
export const faqKeyboard = new InlineKeyboard()
    .text("📋 Что входит в стоимость?", "faq_included").row() // Новый пункт из фото
    .text("📅 Сколько длится курс?", "faq_duration").row()
    .text("💊 Что мы лечим?", "faq_diseases").row()
    .text("📞 Записаться на лечение", "contact_operator").row() // Всегда ведем к продаже
    .text("🔙 Назад", "back_main");

// Универсальная кнопка назад + оператор
export const backKeyboard = new InlineKeyboard()
    .text("📞 Задать вопрос оператору", "contact_operator").row()
    .text("🔙 Назад в меню", "back_main");