export const locales = {
  ru: {
    choose_lang: "🇷🇺 Выберите язык:\n🇺🇿 Тилни танланг:\n🇰🇿 Тілді таңдаңыз:",
    welcome:
      "👋 Здравствуйте, {name}!\n\nДобро пожаловать в бота сети клиник **Orzu Medical**.\nВыберите интересующий раздел:",
    btn_about: "🏥 О клинике и Методика",
    btn_prices: "💰 Актуальный Прайс-лист",
    btn_contacts: "📍 Филиалы и Адреса",
    btn_faq: "❓ Частые вопросы",
    btn_checkup: "🩺 Тест: Пора ли в санаторий?",
    btn_bmi: "⚖️ Калькулятор ИМТ",
    btn_sub_diary: "🌿 Подписаться на Дневник Здоровья",
    btn_unsub_diary: "🔕 Отписаться от Дневника",
    btn_operator: "📞 Связаться с оператором",
    btn_site: "🌐 Наш сайт",
    about_text: `🏥 **Orzu Medical — Возвращаем здоровье без таблеток**\n\nМы работаем с **1997 года** и за это время помогли тысячам людей вернуть радость полноценной жизни. У истоков клиники стоят врач с 50-летним стажем Рустамова Арзигул и Адилбеков Баходир.\n\n🌿 **В чем наш секрет?**\nМы не "глушим" симптомы. Мы устраняем корень болезней через **глубокое очищение организма** (печени, кишечника, сосудов) от накопившихся токсинов, шлаков и солей.\n\n✨ **Как мы лечим:**\n• Лечебное голодание и персональная диета\n• Древние рецепты фитотерапии Ибн Сины\n• Озоно- и лазеротерапия\n• Гирудотерапия и лечение пчелиным ядом\n• Релакс: кедровые бочки и соляные пещеры\n\n📖 Узнайте больше в нашей книге: [Читать онлайн](https://orzu-medical-electron-book.vercel.app/)`,
    btn_ask_operator: "📞 Задать вопрос оператору",
    btn_back_menu: "🔙 Назад в меню",
    bmi_start_title:
      "⚖️ **Калькулятор Индекса Массы Тела (ИМТ)**\n\nДавайте проверим, в норме ли ваш вес. Отправьте мне ваш **текущий вес в килограммах** (например: 75):",
    bmi_err_num:
      "⚠️ Пожалуйста, введите корректное число (например: 75 или 170).",
    bmi_err_weight: "⚠️ Указан нереалистичный вес. Попробуйте снова:",
    bmi_ask_height:
      "✅ Принято. Теперь отправьте ваш **рост в сантиметрах** (например: 175):",
    bmi_err_height:
      "⚠️ Указан нереалистичный рост. Попробуйте снова (в сантиметрах):",
    bmi_verdict_under: "Недостаточная масса тела 📉",
    bmi_advice_under:
      "Вам может не хватать нутриентов. В клинике мы поможем нормализовать работу ЖКТ для лучшего усвоения пищи.",
    bmi_verdict_normal: "Норма! Вы молодец 🍏",
    bmi_advice_normal:
      "Поддерживайте форму! Детокс 1-2 раза в год поможет сохранить этот результат надолго.",
    bmi_verdict_over: "Избыточная масса тела ⚠️",
    bmi_advice_over:
      "Пора обратить внимание на питание. Лечебное голодание и очищение печени в нашей клинике помогут запустить метаболизм.",
    bmi_verdict_obese: "Ожирение 🚨",
    bmi_advice_obese:
      "Лишний вес — сильная нагрузка на суставы и сердце. В Orzu Medical мы комплексно лечим жировой гепатоз печени и помогаем безопасно снизить вес под контролем врачей.",
    bmi_result:
      "📊 **Ваш ИМТ: {bmi}**\n**Статус:** {verdict}\n\n👨‍⚕️ **Рекомендация:** {advice}",
    btn_weight_programs: "📞 Узнать о программах похудения",
    chk_q1:
      "🩺 **Шаг 1 из 3: Как вы оцениваете свой сон?**\n\nЧасто ли вы просыпаетесь разбитым или страдаете бессонницей?",
    chk_a1_1: "Да, сплю плохо/не высыпаюсь",
    chk_a1_2: "Нет, сплю отлично",
    chk_q2:
      "🩺 **Шаг 2 из 3: Беспокоят ли вас боли?**\n\nЧувствуете ли вы тяжесть в спине, шее или боли в суставах к концу дня?",
    chk_a2_1: "Часто болит спина/суставы",
    chk_a2_2: "Ничего не беспокоит",
    chk_q3:
      "🩺 **Шаг 3 из 3: Уровень энергии**\n\nЧасто ли вы испытываете стресс, раздражительность или хроническую усталость?",
    chk_a3_1: "Постоянный стресс и усталость",
    chk_a3_2: "Я полон(на) энергии",
    chk_res_bad:
      "🚨 **Результат: Вашему организму срочно нужна перезагрузка!**\n\nСимптомы указывают на накопившуюся усталость и, возможно, зашлакованность организма. Курс детоксикации в **Orzu Medical** поможет вам вернуть глубокий сон, легкость в теле и энергию.\n\n💡 _Рекомендуем обратить внимание на филиалы с кедровыми бочками и релакс-процедурами (например, Паркент или Юнусабад)._",
    chk_res_good:
      "✅ **Результат: Вы в отличной форме!**\n\nПродолжайте заботиться о себе. Но помните, что профилактика — лучшее лечение. Приезжайте к нам просто отдохнуть на пару дней, подышать свежим воздухом и сходить на массаж!",
    btn_consult: "📞 Проконсультироваться",
    contacts_text: `🗺 **Адреса наших филиалов**\n_Единый график работы: Пн-Сб с 8:30 до 17:00_\n\n🏢 **Юнусабад (Ташкент)**\nЮнусабадский район, 8-квартал, ул. Фарогат, 10-Б\n📞 +998 (55) 508-10-10\n\n🏢 **Фотима Султан**\nТашкентский район, МФГ Тутзор, ул. ТХАЙ Ёкаси, 14\n📞 +998 (55) 508-10-10\n\n🏢 **Зангиота**\nЗангиатинский район, махалля Урта, ул. А.Темур, 180А\n📞 +998 (55) 508-10-10\n\n🏢 **Аккурган**\nАккурганский район, г. Аккурган, ул. Айбек, 5\n📞 +998 (55) 508-10-10\n\n🏢 **Паркент**\nПаркентский район, махалля Каракалпак, ул. Шифокорлар, 100А\n📞 +998 (55) 508-10-10\n\n🏢 **Янгибазар**\nЮкоричирчикский р-н, городок Янгибазар, махалля Иттифок, ул. Толарик, 34\n📞 +998 (55) 508-10-10\n\n🏢 **Насиба-Бону (Чиназ)**\nЧиназский район, колхоз Эрназарова, махалля Маданият, ул. Самаркандская, 8\n📞 +998 (55) 508-10-10`,
    operator_text: `📞 **Связь с оператором**\n\nНажмите кнопку **"{btn_text}"** внизу экрана, и мы перезвоним вам в течение 15 минут!\n\nИли позвоните в главный офис:\n🇺🇿 **+998 (55) 508-10-10**`,
    btn_send_contact: "📱 Отправить мой номер",
    contact_received:
      "✅ **Спасибо, {name}!**\nВаша заявка принята. Оператор скоро свяжется с вами по номеру {phone}.",
    main_menu_label: "Главное меню:",
    diary_sub_success:
      "✅ **Вы успешно подписались на Дневник Здоровья!**\n\nКаждое утро я буду присылать вам короткие советы по питанию, напоминания выпить воды или сделать разминку. Заботьтесь о себе вместе с Orzu Medical 🌿",
    diary_sub_error: "❌ Произошла ошибка. Попробуйте позже.",
    diary_unsub_success:
      "🔕 **Вы отписались от Дневника Здоровья.**\nВы больше не будете получать утренние советы.",
    toast_task_done: "🎉 Отличная работа! Так держать!",
    btn_task_done: "✅ Задание выполнено. Вы молодец!",
    toast_task_already_done: "Вы уже отметили это задание! 😉",
    faq_title: "❓ **Выберите интересующий вопрос:**",
    btn_faq_included: "📋 Что входит в стоимость?",
    btn_faq_duration: "📅 Сколько длится курс?",
    btn_faq_diseases: "💊 Что мы лечим?",
    btn_faq_book: "📞 Записаться на лечение",

    faq_included_text: `💎 **Формат «Всё включено»**\n_Вы платите один раз — никаких скрытых доплат!_\n\n🛏 **Базовый комфорт:**\n• Проживание в уютных палатах\n• Специальное диетическое питание\n• Консультации врачей и полная диагностика\n• Все необходимые лекарства и капельницы\n\n🧬 **Медицинские процедуры:**\n• Очищение (зондирование, клизмы)\n• Физиотерапия, УЗТ, УВЧ и электрофорез\n• Хиджама, иглотерапия и апитерапия (пчелы)\n• Лечебный массаж и парафинотерапия\n• Озоно- и лазеротерапия\n• Фитотерапия и кислородные пенки\n\n🧘‍♀️ **Душа и тело:**\n• Аромасауна\n• Психотренинги («Тренинги счастья»)\n• Лечебная гимнастика`,

    faq_duration_text:
      "⏳ **Сколько длится курс?**\n\nСтандартный курс лечения — **10 дней.**\n\nИменно столько времени нужно, чтобы поэтапно и безопасно очистить печень, кишечник и желчные пути, а также запустить естественное восстановление иммунитета.",

    faq_diseases_text:
      "🛡 **С какими проблемами мы помогаем?**\n\n_Мы лечим причину, а не следствие. К нам обращаются при:_\n\n🔸 Сахарном диабете 2 типа\n🔸 Гипертонии (повышенном давлении)\n🔸 Остеохондрозе, болях в суставах, грыжах и артрозах\n🔸 Лишнем весе и жировом гепатозе печени\n🔸 Проблемах с ЖКТ (хронический панкреатит и др.)\n🔸 Кожных заболеваниях (псориаз, аллергии)",
    prices_text: `💰 **Стоимость путевки (Курс 10 дней)**\n_Цена указана за 1 человека. Включено проживание, питание и ВСЕ процедуры._\n\n📍 **Филиал "Юнусабад" (г. Ташкент)**\n• Палаты (201-211): **5 900 000 сум**\n• Палаты (301-401): **5 500 000 сум**\n\n📍 **Филиал "Фотима Султон"**\n• 2-местная палата: **6 900 000 сум**\n• 3- и 4-местные: **6 300 000 сум**\n\n📍 **Филиал "Зангиота"**\n• 2-местная палата: **5 720 000 сум**\n• 3- и 4-местные: **5 300 000 сум**\n\n📍 **Филиал "Аккурган"**\n• Стандарт: **4 800 000 сум**\n• Люкс: **5 570 000 сум**\n_(Для иностранных граждан: 5 100 000 сум)_\n\n📍 **Филиал "Паркент"**\n• 1-местная палата: **4 840 000 сум**\n• 2-местная палата: **4 620 000 сум**\n• 3-местная палата: **4 350 000 сум**\n• 4-местная палата: **4 070 000 сум**\n\n📍 **Филиал "Янги Базар"**\n• 2-местная палата: **4 620 000 сум**\n• 3-местная палата: **4 350 000 сум**\n• 4-местная палата: **4 070 000 сум**\n\n📍 **Филиал "Насиба Бону" (Чиназ)**\n• 2, 3 и 4-местные: **4 150 000 сум**`,
  },
  uz: {
    welcome:
      "👋 Ассалому алайкум, {name}!\n\n**Orzu Medical** клиникалар тармоғининг ботига хуш келибсиз.\nКеракли бўлимни танланг:",
    btn_about: "🏥 Клиника ҳақида ва Усуллар",
    btn_prices: "💰 Жорий Нархлар",
    btn_contacts: "📍 Филиаллар ва Манзиллар",
    btn_faq: "❓ Кўп бериладиган саволлар",
    btn_checkup: "🩺 Тест: Санаторийга вақт келдими?",
    btn_bmi: "⚖️ ТМК Калькулятори",
    btn_sub_diary: "🌿 Саломатлик кундалигига обуна бўлиш",
    btn_unsub_diary: "🔕 Кундаликдан обунани бекор қилиш",
    btn_operator: "📞 Оператор билан боғланиш",
    btn_site: "🌐 Бизнинг сайт",
    about_text: `🏥 **Orzu Medical — Salomatlikni dorilarsiz qaytaramiz**\n\nBiz **1997 yildan** beri faoliyat yuritamiz va minglab insonlarga to'laqonli hayot quvonchini qaytarishga yordam berdik. Klinika asoschilari — 50 yillik tajribaga ega shifokor Rustamova Arzigul va Adilbekov Bahodir.\n\n🌿 **Sirimiz nimada?**\nBiz simptomlarni "bostirmaymiz". Biz organizmni (jigar, ichaklar, qon tomirlar) yig'ilib qolgan toksinlar, shlaklar va tuzlardan **chuqur tozalash** orqali kasalliklarning ildizini yo'q qilamiz.\n\n✨ **Qanday davolaymiz:**\n• Shifobaxsh ochlik va shaxsiy dieta\n• Ibn Sinoning fitoterapiya qadimiy retseptlari\n• Ozono- va lazeroterapiya\n• Girudoterapiya va asalari zahari bilan davolash\n• Rilaks: kedr bochkalari va tuzli g'orlar\n\n📖 Kitobimizda ko'proq bilib oling: [Onlayn o'qish](https://orzu-medical-electron-book.vercel.app/)`,
    btn_ask_operator: "📞 Operatorga savol berish",
    btn_back_menu: "🔙 Menyuga qaytish",
    bmi_start_title:
      "⚖️ **Tana massasi indeksi (TMI) kalkulyatori**\n\nVazningiz me'yordami, keling tekshiramiz. Menga **hozirgi vazningizni kilogrammda** yuboring (masalan: 75):",
    bmi_err_num: "⚠️ Iltimos, to'g'ri raqam kiriting (masalan: 75 yoki 170).",
    bmi_err_weight: "⚠️ Noto'g'ri vazn kiritildi. Qaytadan urinib ko'ring:",
    bmi_ask_height:
      "✅ Qabul qilindi. Endi **bo'yingizni santimetrda** yuboring (masalan: 175):",
    bmi_err_height:
      "⚠️ Noto'g'ri bo'y kiritildi. Qaytadan urinib ko'ring (santimetrda):",
    bmi_verdict_under: "Vazn yetishmovchiligi 📉",
    bmi_advice_under:
      "Sizga ozuqa moddalari yetishmayotgan bo'lishi mumkin. Klinikada biz ovqat yaxshi hazm bo'lishi uchun oshqozon-ichak trakti ishini normallashtirishga yordam beramiz.",
    bmi_verdict_normal: "Me'yor! Barakalla 🍏",
    bmi_advice_normal:
      "Shaklni saqlang! Yiliga 1-2 marta detoks bu natijani uzoq vaqt saqlab qolishga yordam beradi.",
    bmi_verdict_over: "Ortiqcha vazn ⚠️",
    bmi_advice_over:
      "Ovqatlanishga e'tibor qaratish vaqti keldi. Shifobaxsh ochlik va jigarni tozalash metabolizmni ishga tushirishga yordam beradi.",
    bmi_verdict_obese: "Semizlik 🚨",
    bmi_advice_obese:
      "Ortiqcha vazn — bo'g'imlar va yurakka kuchli yuklama. Orzu Medicalda biz yog'li gepatozni kompleks davolaymiz va shifokorlar nazorati ostida vaznni xavfsiz kamaytirishga yordam beramiz.",
    bmi_result:
      "📊 **Sizning TMIningiz: {bmi}**\n**Holat:** {verdict}\n\n👨‍⚕️ **Tavsiya:** {advice}",
    btn_weight_programs: "📞 Ozish dasturlari haqida bilish",
    chk_q1:
      "🩺 **1-qadam (3 tadan): Uyqungizni qanday baholaysiz?**\n\nTez-tez charchagan holda uyg'onasizmi yoki uyqusizlikdan qiynalasizmi?",
    chk_a1_1: "Ha, yomon uxlayman/to'yib uxlamayman",
    chk_a1_2: "Yo'q, ajoyib uxlayman",
    chk_q2:
      "🩺 **2-qadam: Og'riqlar bezovta qiladimi?**\n\nKun oxirida bel, bo'yin yoki bo'g'imlarda og'riq va og'irlik his qilasizmi?",
    chk_a2_1: "Tez-tez belim/bo'g'imlarim og'riydi",
    chk_a2_2: "Hech narsa bezovta qilmaydi",
    chk_q3:
      "🩺 **3-qadam: Energiya darajasi**\n\nTez-tez stress, asabiylashish yoki surunkali charchoqni his qilasizmi?",
    chk_a3_1: "Doimiy stress va charchoq",
    chk_a3_2: "Energiyaga to'laman",
    chk_res_bad:
      "🚨 **Natija: Organizmingizga zudlik bilan qayta yuklanish kerak!**\n\nSimptomlar yig'ilib qolgan charchoq va ehtimol organizm shlaklanishini ko'rsatadi. **Orzu Medical**da detoks kursi chuqur uyqu, tanadagi yengillik va energiyani qaytarishga yordam beradi.\n\n💡 _Kedr bochkalari va relaks-muolajalar mavjud bo'lgan filiallarimizga (masalan, Parkent yoki Yunusobod) e'tibor qaratishingizni maslahat beramiz._",
    chk_res_good:
      "✅ **Natija: Siz ajoyib formadasiz!**\n\nO'zingizga g'amxo'rlik qilishda davom eting. Lekin unutmangki, profilaktika — eng yaxshi davo. Biznikiga bir-ikki kunga dam olish, toza havodan nafas olish va massajga kelib keting!",
    btn_consult: "📞 Konsultatsiya olish",
    contacts_text: `🗺 **Filiallarimiz manzillari**\n_Yagona ish jadvali: Du-Sha 8:30 dan 17:00 gacha_\n\n🏢 **Yunusobod (Toshkent)**\nYunusobod tumani, 8-mavze, Farog'at ko'chasi, 10-B\n📞 +998 (55) 508-10-10\n\n🏢 **Fotima Sulton**\nToshkent tumani, Tutzor MFY, TXAY Yoqasi ko'chasi, 14\n📞 +998 (55) 508-10-10\n\n🏢 **Zangiota**\nZangiota tumani, O'rta mahallasi, A.Temur ko'chasi, 180A\n📞 +998 (55) 508-10-10\n\n🏢 **Oqqo'rg'on**\nOqqo'rg'on tumani, Oqqo'rg'on shahri, Oybek ko'chasi, 5\n📞 +998 (55) 508-10-10\n\n🏢 **Parkent**\nParkent tumani, Qoraqalpoq mahallasi, Shifokorlar ko'chasi, 100A\n📞 +998 (55) 508-10-10\n\n🏢 **Yangibozor**\nYuqorichirchiq tumani, Yangibozor shaharchasi, Ittifoq mahallasi, Tolariq ko'chasi, 34\n📞 +998 (55) 508-10-10\n\n🏢 **Nasiba-Bonu (Chinoz)**\nChinoz tumani, Ernazarov kolxozi, Madaniyat mahallasi, Samarqand ko'chasi, 8\n📞 +998 (55) 508-10-10`,
    operator_text: `📞 **Operator bilan bog'lanish**\n\nEkranning pastki qismidagi **"{btn_text}"** tugmasini bosing va biz sizga 15 daqiqa ichida qo'ng'iroq qilamiz!\n\nYoki bosh ofisga qo'ng'iroq qiling:\n🇺🇿 **+998 (55) 508-10-10**`,
    btn_send_contact: "📱 Raqamimni yuborish",
    contact_received:
      "✅ **Rahmat, {name}!**\nSorovnomangiz qabul qilindi. Operator tez orada siz bilan {phone} raqami orqali bog'lanadi.",
    main_menu_label: "Asosiy menyu:",
    diary_sub_success:
      "✅ **Siz Salomatlik Kundaligiga muvaffaqiyatli obuna bo'ldingiz!**\n\nHar tong men sizga ovqatlanish bo'yicha qisqa maslahatlar, suv ichish yoki mashq bajarish eslatmalarini yuboraman. Orzu Medical bilan birga o'zingizga g'amxo'rlik qiling 🌿",
    diary_sub_error: "❌ Xatolik yuz berdi. Keyinroq qayta urinib ko'ring.",
    diary_unsub_success:
      "🔕 **Siz Salomatlik Kundaligidan obunani bekor qildingiz.**\nSiz endi tongi maslahatlarni olmaysiz.",
    toast_task_done: "🎉 Ajoyib ish! Xuddi shunday davom eting!",
    btn_task_done: "✅ Vazifa bajarildi. Barakalla!",
    toast_task_already_done: "Siz bu vazifani allaqachon belgilagansiz! 😉",
    faq_title: "❓ **Sizni qiziqtirgan savolni tanlang:**",
    btn_faq_included: "📋 Narxiga nimalar kiradi?",
    btn_faq_duration: "📅 Kurs qancha davom etadi?",
    btn_faq_diseases: "💊 Nimalarni davolaymiz?",
    btn_faq_book: "📞 Davolanishga yozilish",

    faq_included_text: `💎 **«Barchasi ichida» formati**\n_Siz bir marta to'laysiz — hech qanday yashirin to'lovlar yo'q!_\n\n🛏 **Baza qulayliklari:**\n• Qulay palatalarda yashash\n• Maxsus parhez ovqatlanish\n• Shifokorlar maslahati va to'liq diagnostika\n• Barcha kerakli dori-darmonlar va osma ukollar (kapelnitsalar)\n\n🧬 **Tibbiy muolajalar:**\n• Tozalash (zondlash, klizma)\n• Fizioterapiya, UTT, UYCh va elektroforez\n• Hijoma, igna sanchish va apiterapiya (asalari bilan davolash)\n• Shifobaxsh massaj va parafinoterapiya\n• Ozono- va lazeroterapiya\n• Fitoterapiya va kislorodli ko'piklar\n\n🧘‍♀️ **Ruh va tana:**\n• Aromasauna\n• Psixotreninglar («Baxt treninglari»)\n• Shifobaxsh gimnastika`,

    faq_duration_text:
      "⏳ **Kurs qancha davom etadi?**\n\nStandart davolanish kursi — **10 kun.**\n\nAynan shuncha vaqt jigar, ichak va o't yo'llarini bosqichma-bosqich va xavfsiz tozalash, shuningdek, immunitetning tabiiy tiklanishini ishga tushirish uchun kerak.",

    faq_diseases_text:
      "🛡 **Qanday muammolarga yordam beramiz?**\n\n_Biz oqibatni emas, sababni davolaymiz. Bizga quyidagi hollarda murojaat qilishadi:_\n\n🔸 2-toifa qandli diabet\n🔸 Gipertoniya (qon bosimi oshishi)\n🔸 Osteoxondroz, bo'g'imlardagi og'riqlar, grija va artrozlar\n🔸 Ortiqcha vazn va jigarning yog'li gepatozi\n🔸 OIT muammolari (surunkali pankreatit va boshq.)\n🔸 Teri kasalliklari (psoriaz, allergiya)",
    prices_text: `💰 **Yo'llanma narxi (10 kunlik kurs)**\n_Narx 1 kishi uchun ko'rsatilgan. Yashash, ovqatlanish va BARCHA muolajalar kiritilgan._\n\n📍 **"Yunusobod" filiali (Toshkent sh.)**\n• Palatalar (201-211): **5 900 000 so'm**\n• Palatalar (301-401): **5 500 000 so'm**\n\n📍 **"Fotima Sulton" filiali**\n• 2 o'rinli palata: **6 900 000 so'm**\n• 3 va 4 o'rinli: **6 300 000 so'm**\n\n📍 **"Zangiota" filiali**\n• 2 o'rinli palata: **5 720 000 so'm**\n• 3 va 4 o'rinli: **5 300 000 so'm**\n\n📍 **"Oqqo'rg'on" filiali**\n• Standart: **4 800 000 so'm**\n• Lyuks: **5 570 000 so'm**\n_(Chet el fuqarolari uchun: 5 100 000 so'm)_\n\n📍 **"Parkent" filiali**\n• 1 o'rinli palata: **4 840 000 so'm**\n• 2 o'rinli palata: **4 620 000 so'm**\n• 3 o'rinli palata: **4 350 000 so'm**\n• 4 o'rinli palata: **4 070 000 so'm**\n\n📍 **"Yangibozor" filiali**\n• 2 o'rinli palata: **4 620 000 so'm**\n• 3 o'rinli palata: **4 350 000 so'm**\n• 4 o'rinli palata: **4 070 000 so'm**\n\n📍 **"Nasiba Bonu" filiali (Chinoz)**\n• 2, 3 va 4 o'rinli: **4 150 000 so'm**`,
  },
  kz: {
    welcome:
      "👋 Сәлеметсіз бе, {name}!\n\n**Orzu Medical** емханалар желісінің ботына қош келдіңіз.\nҚажетті бөлімді таңдаңыз:",
    btn_about: "🏥 Емхана туралы және Әдістер",
    btn_prices: "💰 Ағымдағы Бағалар",
    btn_contacts: "📍 Филиалдар мен Мекен-жайлар",
    btn_faq: "❓ Жиі қойылатын сұрақтар",
    btn_checkup: "🩺 Тест: Шипажайға уақыт келді ме?",
    btn_bmi: "⚖️ ДСИ Калькуляторы",
    btn_sub_diary: "🌿 Денсаулық күнделігіне жазылу",
    btn_unsub_diary: "🔕 Күнделіктен бас тарту",
    btn_operator: "📞 Оператормен байланысу",
    btn_site: "🌐 Біздің сайт",
    about_text: `🏥 **Orzu Medical — Денсаулықты дәрі-дәрмексіз қайтарамыз**\n\nБіз **1997 жылдан** бері жұмыс істейміз және мыңдаған адамдарға толыққанды өмір қуанышын қайтаруға көмектестік. Емхананың негізін қалаушылар — 50 жылдық өтілі бар дәрігер Рустамова Арзигул мен Әділбеков Баходир.\n\n🌿 **Құпиямыз неде?**\nБіз симптомдарды "баспаймыз". Біз ағзаны (бауыр, ішек, тамырлар) жиналып қалған токсиндерден, шлактардан және тұздардан **терең тазарту** арқылы аурулардың тамырын жоямыз.\n\n✨ **Қалай емдейміз:**\n• Емдік ашығу және жеке диета\n• Ибн Синаның фитотерапиялық ежелгі рецепттері\n• Озоно- және лазеротерапия\n• Сүлікпен емдеу (гирудотерапия) және ара уымен емдеу\n• Релакс: самырсын бөшкелері мен тұз үңгірлері\n\n📖 Біздің кітаптан көбірек біліңіз: [Онлайн оқу](https://orzu-medical-electron-book.vercel.app/)`,
    btn_ask_operator: "📞 Операторға сұрақ қою",
    btn_back_menu: "🔙 Мәзірге қайту",
    bmi_start_title:
      "⚖️ **Дене салмағының индексі (ДСИ) калькуляторы**\n\nСалмағыңыз қалыпты екенін тексерейік. Маған **қазіргі салмағыңызды килограммен** жіберіңіз (мысалы: 75):",
    bmi_err_num: "⚠️ Дұрыс сан енгізіңіз (мысалы: 75 немесе 170).",
    bmi_err_weight:
      "⚠️ Шынайы емес салмақ көрсетілген. Қайтадан байқап көріңіз:",
    bmi_ask_height:
      "✅ Қабылданды. Енді **бойыңызды сантиметрмен** жіберіңіз (мысалы: 175):",
    bmi_err_height:
      "⚠️ Шынайы емес бой көрсетілген. Қайтадан байқап көріңіз (сантиметрмен):",
    bmi_verdict_under: "Салмақ жетіспеушілігі 📉",
    bmi_advice_under:
      "Сізге қоректік заттар жетіспеуі мүмкін. Емханада тамақтың жақсы сіңуі үшін асқазан-ішек жолдарының жұмысын қалпына келтіруге көмектесеміз.",
    bmi_verdict_normal: "Қалыпты! Жарайсыз 🍏",
    bmi_advice_normal:
      "Пішініңізді сақтаңыз! Жылына 1-2 рет детокс бұл нәтижені ұзақ сақтауға көмектеседі.",
    bmi_verdict_over: "Артық салмақ ⚠️",
    bmi_advice_over:
      "Тамақтануға назар аударатын кез келді. Емдік ашығу және бауырды тазарту метаболизмді іске қосуға көмектеседі.",
    bmi_verdict_obese: "Семіздік 🚨",
    bmi_advice_obese:
      "Артық салмақ — буындар мен жүрекке үлкен салмақ. Orzu Medical-да біз бауырдың майлы гепатозын кешенді түрде емдейміз және дәрігерлердің бақылауымен салмақты қауіпсіз төмендетуге көмектесеміз.",
    bmi_result:
      "📊 **Сіздің ДСИ: {bmi}**\n**Күйі:** {verdict}\n\n👨‍⚕️ **Ұсыныс:** {advice}",
    btn_weight_programs: "📞 Арықтау бағдарламалары туралы білу",
    chk_q1:
      "🩺 **1-қадам (3-тен): Ұйқыңызды қалай бағалайсыз?**\n\nЖиі шаршап оянасыз ба немесе ұйқысыздықтан қиналасыз ба?",
    chk_a1_1: "Иә, нашар ұйықтаймын/ұйқым қанбайды",
    chk_a1_2: "Жоқ, тамаша ұйықтаймын",
    chk_q2:
      "🩺 **2-қадам: Ауырсынулар мазалай ма?**\n\nКүн соңында арқа, мойын немесе буындарда ауырсыну сезінесіз бе?",
    chk_a2_1: "Жиі арқам/буындарым ауырады",
    chk_a2_2: "Ештеңе мазаламайды",
    chk_q3:
      "🩺 **3-қадам: Энергия деңгейі**\n\nЖиі стресс, тітіркену немесе созылмалы шаршау сезінесіз бе?",
    chk_a3_1: "Тұрақты стресс пен шаршау",
    chk_a3_2: "Энергияға толымын",
    chk_res_bad:
      "🚨 **Нәтиже: Ағзаңызға шұғыл қайта жүктелу қажет!**\n\nСимптомдар жиналған шаршау мен ағзаның шлактанғанын көрсетеді. **Orzu Medical**-дағы детокс курсы терең ұйқыны, денедегі жеңілдік пен энергияны қайтаруға көмектеседі.\n\n💡 _Самырсын бөшкелері мен релакс-емшаралары бар филиалдарға (мысалы, Паркент немесе Юнусабад) назар аударуды ұсынамыз._",
    chk_res_good:
      "✅ **Нәтиже: Сіз керемет формадасыз!**\n\nӨзіңізге күтім жасауды жалғастырыңыз. Бірақ профилактика — ең жақсы ем екенін ұмытпаңыз. Бізге бір-екі күнге демалуға, таза ауа жұтуға және массажға келіп кетіңіз!",
    btn_consult: "📞 Кеңес алу",
    contacts_text: `🗺 **Филиалдарымыздың мекен-жайлары**\n_Бірыңғай жұмыс кестесі: Дс-Сн 8:30-дан 17:00-ге дейін_\n\n🏢 **Юнусабад (Ташкент)**\nЮнусабад ауданы, 8-квартал, Фарогат көшесі, 10-Б\n📞 +998 (55) 508-10-10\n\n🏢 **Фотима Султан**\nТашкент ауданы, Тұтзор МФГ, ТХАЙ Ёкаси көшесі, 14\n📞 +998 (55) 508-10-10\n\n🏢 **Зангиота**\nЗангиата ауданы, Урта махалласы, А.Темур көшесі, 180А\n📞 +998 (55) 508-10-10\n\n🏢 **Аккурган**\nАккурган ауданы, Аккурган қаласы, Айбек көшесі, 5\n📞 +998 (55) 508-10-10\n\n🏢 **Паркент**\nПаркент ауданы, Қарақалпақ махалласы, Шифокорлар көшесі, 100А\n📞 +998 (55) 508-10-10\n\n🏢 **Янгибазар**\nЮкоричирчик ауданы, Янгибазар қалашығы, Иттифок махалласы, Толарик көшесі, 34\n📞 +998 (55) 508-10-10\n\n🏢 **Насиба-Бону (Чиназ)**\nЧиназ ауданы, Эрназарова колхозы, Маданият махалласы, Самаркандская көшесі, 8\n📞 +998 (55) 508-10-10`,
    operator_text: `📞 **Оператормен байланысу**\n\nЭкранның төменгі жағындағы **"{btn_text}"** түймесін басыңыз, біз сізге 15 минут ішінде хабарласамыз!\n\nНемесе бас кеңсеге қоңырау шалыңыз:\n🇺🇿 **+998 (55) 508-10-10**`,
    btn_send_contact: "📱 Нөмірімді жіберу",
    contact_received:
      "✅ **Рахмет, {name}!**\nӨтінішіңіз қабылданды. Оператор жақында сізбен {phone} нөмірі бойынша байланысады.",
    main_menu_label: "Басты мәзір:",
    diary_sub_success:
      "✅ **Сіз Денсаулық күнделігіне сәтті жазылдыңыз!**\n\nКүн сайын таңертең мен сізге тамақтану туралы қысқаша кеңестер, су ішу немесе жаттығу жасау туралы ескертулер жіберемін. Orzu Medical-мен бірге өзіңізге қамқорлық жасаңыз 🌿",
    diary_sub_error: "❌ Қате пайда болды. Кейінірек қайталап көріңіз.",
    diary_unsub_success:
      "🔕 **Сіз Денсаулық күнделігінен бас тарттыңыз.**\nСіз бұдан былай таңертеңгі кеңестерді алмайсыз.",
    toast_task_done: "🎉 Керемет жұмыс! Осылай жалғастырыңыз!",
    btn_task_done: "✅ Тапсырма орындалды. Жарайсыз!",
    toast_task_already_done: "Сіз бұл тапсырманы белгілеп қойдыңыз! 😉",
    faq_title: "❓ **Қызықтыратын сұрақты таңдаңыз:**",
    btn_faq_included: "📋 Бағаға не кіреді?",
    btn_faq_duration: "📅 Курс қанша уақытқа созылады?",
    btn_faq_diseases: "💊 Біз нені емдейміз?",
    btn_faq_book: "📞 Емделуге жазылу",

    faq_included_text: `💎 **«Барлығы қосылған» пішімі**\n_Сіз бір рет төлейсіз — ешқандай жасырын қосымша ақы жоқ!_\n\n🛏 **Базалық жайлылық:**\n• Жайлы палаталарда тұру\n• Арнайы диеталық тамақтану\n• Дәрігерлер кеңесі және толық диагностика\n• Барлық қажетті дәрі-дәрмектер мен тамшылатқыштар\n\n🧬 **Медициналық емшаралар:**\n• Тазарту (зондтау, клизма)\n• Физиотерапия, УДТ, ЖЖЖ және электрофорез\n• Хиджама, инемен емдеу және апитерапия (ара)\n• Емдік массаж және парафинотерапия\n• Озоно- және лазеротерапия\n• Фитотерапия және оттегі көбіктері\n\n🧘‍♀️ **Жан мен тән:**\n• Аромасауна\n• Психотренингтер («Бақыт тренингтері»)\n• Емдік гимнастика`,

    faq_duration_text:
      "⏳ **Курс қанша уақытқа созылады?**\n\nСтандартты емдеу курсы — **10 күн.**\n\nБауырды, ішекті және өт жолдарын кезең-кезеңімен және қауіпсіз тазарту, сондай-ақ иммунитеттің табиғи қалпына келуін іске қосу үшін дәл осынша уақыт қажет.",

    faq_diseases_text:
      "🛡 **Қандай мәселелермен көмектесеміз?**\n\n_Біз салдарды емес, себепті емдейміз. Бізге мына жағдайларда жүгінеді:_\n\n🔸 2-ші типті қант диабеті\n🔸 Гипертония (жоғары қан қысымы)\n🔸 Остеохондроз, буын аурулары, жарықтар және артроздар\n🔸 Артық салмақ және бауырдың майлы гепатозы\n🔸 АІЖ мәселелері (созылмалы панкреатит және т.б.)\n🔸 Тері аурулары (псориаз, аллергия)",
    prices_text: `💰 **Жолдама құны (10 күндік курс)**\n_Бағасы 1 адамға көрсетілген. Тұру, тамақтану және БАРЛЫҚ емшаралар кіреді._\n\n📍 **"Юнусабад" филиалы (Ташкент қ.)**\n• Палаталар (201-211): **5 900 000 сум**\n• Палаталар (301-401): **5 500 000 сум**\n\n📍 **"Фотима Султон" филиалы**\n• 2 орындық палата: **6 900 000 сум**\n• 3 және 4 орындық: **6 300 000 сум**\n\n📍 **"Зангиота" филиалы**\n• 2 орындық палата: **5 720 000 сум**\n• 3 және 4 орындық: **5 300 000 сум**\n\n📍 **"Аккурган" филиалы**\n• Стандарт: **4 800 000 сум**\n• Люкс: **5 570 000 сум**\n_(Шетел азаматтары үшін: 5 100 000 сум)_\n\n📍 **"Паркент" филиалы**\n• 1 орындық палата: **4 840 000 сум**\n• 2 орындық палата: **4 620 000 сум**\n• 3 орындық палата: **4 350 000 сум**\n• 4 орындық палата: **4 070 000 сум**\n\n📍 **"Янги Базар" филиалы**\n• 2 орындық палата: **4 620 000 сум**\n• 3 орындық палата: **4 350 000 сум**\n• 4 орындық палата: **4 070 000 сум**\n\n📍 **"Насиба Бону" филиалы (Чиназ)**\n• 2, 3 және 4 орындық: **4 150 000 сум**`,
  },
};

// Вспомогательная функция для вставки переменных (например, имени)
export function t(
  lang: "ru" | "uz" | "kz",
  key: keyof (typeof locales)["ru"],
  params?: Record<string, string>,
): string {
  // @ts-ignore
  let text = locales[lang][key] || locales["ru"][key];

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v);
    }
  }
  return text;
}
