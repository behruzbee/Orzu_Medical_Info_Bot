import mongoose, { Schema, model, models } from "mongoose";

// 1. Модель для хранения состояния очереди (Round Robin)
const stateSchema = new Schema({
    key: { type: String, required: true, unique: true }, // Например 'main_queue'
    currentIndex: { type: Number, default: 0 },
    totalProcessed: { type: Number, default: 0 }
});

// 2. Модель для хранения истории заявок (Статистика)
const leadSchema = new Schema({
    phone: { type: String, required: true },
    targetGroupId: { type: Number, required: true },
    isDuplicate: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now } // MongoDB сам поставит время
});

const userSchema = new Schema({
    telegramId: { type: Number, required: true, unique: true },
    firstName: { type: String },
    isSubscribed: { type: Boolean, default: false }
});


// Проверка: если модели уже есть (для hot-reload), не создаем заново
export const StateModel = models.State || model("State", stateSchema);
export const LeadModel = models.Lead || model("Lead", leadSchema);
export const UserModel = models.User || model("User", userSchema);
