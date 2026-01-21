import { InlineKeyboard } from "grammy";
import { BotAction } from "../types/enums";

export const mainKeyboard = new InlineKeyboard()
    .text("🏥 О клинике и Методика", BotAction.ABOUT).row()
    .text("💰 Прайс-лист (2025)", BotAction.PRICES)
    .text("📍 Филиалы и Контакты", BotAction.CONTACTS).row()
    .text("❓ Частые вопросы (FAQ)", BotAction.FAQ).row()
    .url("🌐 Наш сайт", "https://orzumedical.uz")
    .url("📚 Читать книгу онлайн", "https://orzu-medical-electron-book.vercel.app/");

export const faqKeyboard = new InlineKeyboard()
    .text("📅 Сколько длится курс?", "faq_duration")
    .text("💊 Что мы лечим?", "faq_diseases").row()
    .text("🔙 Назад", "back_main");

export const backKeyboard = new InlineKeyboard()
    .text("🔙 Назад в меню", "back_main");