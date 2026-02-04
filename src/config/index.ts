import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.BOT_TOKEN) throw new Error("❌ BOT_TOKEN is missing");
if (!process.env.MONGODB_URI) throw new Error("❌ MONGODB_URI is missing");

const sourceGroupId = Number(process.env.SOURCE_GROUP_ID);

export const TARGET_GROUPS = [
    { id: -1003681496844, name: "SMM LID Центральный офис", limit: 40 },
    { id: -1003411289776, name: "SMM LID Parkent", limit: 25 },
    { id: -1003573376730, name: "SMM LID Yangi bozor", limit: 10 },
    { id: -1003512729243, name: "SMM LID Юнусабад", limit: 20 },
];

const targetIds = TARGET_GROUPS.map(g => g.id);

export const config = {
    botToken: process.env.BOT_TOKEN,
    mongoUri: process.env.MONGODB_URI,
    sourceGroupId: sourceGroupId,
    targetGroups: targetIds, // Список ID для балансировщика
    groupsConfig: TARGET_GROUPS, // Полный конфиг с лимитами
    phoneRegex: /([+]?[\d\(\)\-\s]{7,}\d)/
};