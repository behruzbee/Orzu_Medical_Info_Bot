// api/cron-diary.ts
import { Bot } from "grammy";
import { config } from "../src/config";
import { dbConnect } from "../src/db/connect";
import { UserModel } from "../src/db/models";

const bot = new Bot(config.botToken);

// База полезных советов
const HEALTH_TIPS = [
    "💧 **Доброе утро!**\nНачните день со стакана теплой воды. Это запустит работу ЖКТ и ускорит метаболизм.",
    "👀 **Гимнастика для глаз**\nПроводите много времени за экраном? Прямо сейчас зажмурьтесь на 5 секунд, а затем поморгайте быстро-быстро. Повторите 3 раза.",
    "🚶‍♂️ **Движение — жизнь**\nПостарайтесь сегодня пройти хотя бы 5000 шагов. Пешие прогулки отлично снимают стресс и укрепляют сердце.",
    "🍏 **Совет по питанию**\nДобавьте в сегодняшний рацион больше зелени (шпинат, петрушка, укроп). Она помогает печени очищать организм от токсинов.",
    "🧘‍♀️ **Минутка спокойствия**\nСделайте глубокий вдох на 4 счета, задержите дыхание на 4 счета и медленно выдохните на 4 счета. Это быстро снижает уровень кортизола (гормона стресса)."
];

export default async function handler() {
    try {
        // 1. Обязательно подключаемся к БД в серверлесс-функции
        await dbConnect();

        // 2. Находим всех подписанных пользователей
        const subscribers = await UserModel.find({ isSubscribed: true });
        
        if (subscribers.length === 0) {
            return new Response('No subscribers found', { status: 200 });
        }

        // 3. Выбираем случайный совет дня
        const randomTip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
        const messageText = `🌿 **Дневник здоровья Orzu Medical**\n\n${randomTip}`;

        // 4. Рассылаем сообщения
        let successCount = 0;
        for (const user of subscribers) {
            try {
                await bot.api.sendMessage(user.telegramId, messageText, { parse_mode: "Markdown" });
                successCount++;
            } catch (error: any) {
                // Если пользователь заблокировал бота, можно сразу отписать его в БД
                if (error.description && error.description.includes("bot was blocked by the user")) {
                    await UserModel.findOneAndUpdate({ telegramId: user.telegramId }, { isSubscribed: false });
                }
                console.error(`Failed to send to ${user.telegramId}:`, error.message);
            }
            // Небольшая задержка, чтобы не превысить лимиты Telegram (30 сообщений в секунду)
            await new Promise(res => setTimeout(res, 50)); 
        }
        
        return new Response(`Diary sent to ${successCount} users`, { status: 200 });
    } catch (error) {
        console.error("Diary Cron Error:", error);
        return new Response('Error', { status: 500 });
    }
}