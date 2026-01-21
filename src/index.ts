import { bot } from "./bot";

async function bootstrap() {
    console.log("🚀 Orzu Medical Bot запускается...");

    await bot.api.deleteWebhook();
    console.log("🔄 Старый Webhook удален, переходим на Long Polling...");
    
    await bot.start({
        onStart: (botInfo) => {
            console.log(`✅ Бот @${botInfo.username} успешно запущен!`);
        },
    });
}

bootstrap();