import { InlineKeyboard } from "grammy";
import { BotAction } from "../types/enums";
import { t } from "../locales";

// Добавили параметр lang
export const generateMainKeyboard = (
  isSubscribed: boolean,
  lang: "ru" | "uz" | "kz",
) => {
  const kb = new InlineKeyboard()
    .text(t(lang, "btn_about"), BotAction.ABOUT)
    .row()
    .text(t(lang, "btn_prices"), BotAction.PRICES)
    .row()
    .text(t(lang, "btn_contacts"), BotAction.CONTACTS)
    .row()
    .text(t(lang, "btn_faq"), BotAction.FAQ)
    .row()
    .text(t(lang, "btn_checkup"), "start_checkup")
    .row()
    .text(t(lang, "btn_bmi"), "start_bmi")
    .row();

  if (isSubscribed) {
    kb.text(t(lang, "btn_unsub_diary"), "unsubscribe_diary").row();
  } else {
    kb.text(t(lang, "btn_sub_diary"), "subscribe_diary").row();
  }

  kb.text(t(lang, "btn_operator"), "contact_operator")
    .row()
    .url(t(lang, "btn_site"), "https://orzumedical.uz");

  return kb;
};

// Клавиатура выбора языка
export const langKeyboard = new InlineKeyboard()
  .text("🇷🇺 Русский", "set_lang_ru")
  .row()
  .text("🇺🇿 Ўзбек тили", "set_lang_uz")
  .row()
  .text("🇰🇿 Қазақ тілі", "set_lang_kz");

// Меню FAQ
export const generateFaqKeyboard = (lang: "ru" | "uz" | "kz") => {
  return new InlineKeyboard()
    .text(t(lang, "btn_faq_included"), "faq_included")
    .row()
    .text(t(lang, "btn_faq_duration"), "faq_duration")
    .row()
    .text(t(lang, "btn_faq_diseases"), "faq_diseases")
    .row()
    .text(t(lang, "btn_faq_book"), "contact_operator")
    .row() // Кнопка записи (лид)
    .text(t(lang, "btn_back_menu"), "back_main");
};

// Универсальная кнопка назад + оператор
export const generateBackKeyboard = (lang: "ru" | "uz" | "kz") => {
  return new InlineKeyboard()
    .text(t(lang, "btn_ask_operator"), "contact_operator")
    .row()
    .text(t(lang, "btn_back_menu"), "back_main");
};
