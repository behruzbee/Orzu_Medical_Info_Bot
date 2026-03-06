// api/cron-diary.ts
import { Bot, InlineKeyboard } from "grammy";
import { config } from "../src/config";
import { dbConnect } from "../src/db/connect";
import { UserModel } from "../src/db/models";

const bot = new Bot(config.botToken);

// База советов теперь в виде объектов с кнопками
const HEALTH_CHALLENGES = [
    {
        text: "💧 **Доброе утро! Время запустить метаболизм.**\n\nВо время сна наш организм теряет влагу. Стакан теплой воды натощак — это душ для внутренних органов. Он смывает токсины и будит ЖКТ.",
        action: "Выпейте стакан теплой воды прямо сейчас!",
        btnText: "💧 Вода выпита!"
    },
    {
        text: "👀 **Гимнастика для глаз**\n\nЭкраны телефонов напрягают наши мышцы. Дайте им перерыв!",
        action: "Прямо сейчас сильно зажмурьтесь на 5 секунд, а затем поморгайте быстро-быстро. Повторите 3 раза.",
        btnText: "👀 Глаза отдохнули!"
    },
    {
        text: "🚶‍♂️ **Движение — лучший антистресс**\n\nПешие прогулки снижают кортизол и улучшают кровообращение. В наших клиниках мы всегда советуем пациентам гулять на свежем воздухе.",
        action: "Постарайтесь сегодня пройти хотя бы 5000 шагов.",
        btnText: "👟 Принимаю вызов!"
    },
    {
        text: "🥗 **Зеленый щит для печени**\n\nЗелень (шпинат, укроп, петрушка) содержит хлорофилл, который помогает печени фильтровать тяжелые металлы и токсины.",
        action: "Добавьте к своему обеду или ужину порцию свежей зелени.",
        btnText: "🥦 Обязательно добавлю!"
    },
    {
        text: "🧘‍♀️ **Дыхание против стресса (Квадрат)**\n\nЧувствуете напряжение? Попробуйте технику спецназа для быстрого успокоения.",
        action: "Сделайте вдох на 4 счета, задержите дыхание на 4 счета, выдохните на 4 счета и снова задержка на 4 счета.",
        btnText: "🧘‍♀️ Я спокоен (спокойна)!"
    }
];

// Массив дней недели для персонализации
const DAYS_OF_WEEK = [
    "Отличного воскресенья", 
    "Бодрого понедельника", 
    "Продуктивного вторника", 
    "Замечательной среды", 
    "Экватор недели! Хорошего четверга", 
    "Прекрасной пятницы", 
    "Расслабленной субботы"
];

export default async function handler() {
    try {
        await dbConnect();

        const subscribers = await UserModel.find({ isSubscribed: true });
        if (subscribers.length === 0) {
            return new Response('No subscribers found', { status: 200 });
        }

        const todayDay = new Date().getDay();
        const greeting = DAYS_OF_WEEK[todayDay];

        // Выбираем случайный челлендж
        const randomChallenge = HEALTH_CHALLENGES[Math.floor(Math.random() * HEALTH_CHALLENGES.length)];
        
        const messageText = 
            `☀️ **${greeting}!**\n` +
            `_Дневник здоровья Orzu Medical_\n\n` +
            `${randomChallenge.text}\n\n` +
            `🎯 **Задание дня:**\n_${randomChallenge.action}_`;

        // Создаем кнопку для интерактива
        // Мы передаем универсальный callback_data, который обработаем в боте
        const kb = new InlineKeyboard()
            .text(randomChallenge.btnText, "diary_task_done");

        let successCount = 0;
        for (const user of subscribers) {
            try {
                // Если у пользователя есть имя, персонализируем приветствие
                const personalizedMsg = user.firstName 
                    ? messageText.replace(`☀️ **${greeting}!**`, `☀️ **${greeting}, ${user.firstName}!**`) 
                    : messageText;

                await bot.api.sendMessage(user.telegramId, personalizedMsg, { 
                    parse_mode: "Markdown",
                    reply_markup: kb
                });
                successCount++;
            } catch (error: any) {
                if (error.description && error.description.includes("bot was blocked by the user")) {
                    await UserModel.findOneAndUpdate({ telegramId: user.telegramId }, { isSubscribed: false });
                }
            }
            await new Promise(res => setTimeout(res, 50)); 
        }
        
        return new Response(`Diary sent to ${successCount} users`, { status: 200 });
    } catch (error) {
        console.error("Diary Cron Error:", error);
        return new Response('Error', { status: 500 });
    }
}