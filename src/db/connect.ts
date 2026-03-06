import mongoose from "mongoose";
import { config } from "../config";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // 👇 ДОБАВЛЕНО: Жесткие лимиты времени для Serverless (Vercel)
      serverSelectionTimeoutMS: 5000, // Искать сервер не более 5 секунд
      connectTimeoutMS: 5000,         // Ждать подключения не более 5 секунд
    };

    cached.promise = mongoose.connect(config.mongoUri, opts).then((mongoose) => {
      console.log("✅ MongoDB успешно подключена");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Ошибка подключения к MongoDB:", e);
    throw e;
  }

  return cached.conn;
}