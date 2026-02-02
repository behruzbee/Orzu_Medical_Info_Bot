import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.BOT_TOKEN) throw new Error("❌ BOT_TOKEN is missing");
if (!process.env.SOURCE_GROUP_ID) throw new Error("❌ SOURCE_GROUP_ID is missing");
if (!process.env.TARGET_GROUPS) throw new Error("❌ TARGET_GROUPS is missing");

export const config = {
    botToken: process.env.BOT_TOKEN,
    sourceGroupId: Number(process.env.SOURCE_GROUP_ID),
    targetGroups: process.env.TARGET_GROUPS.split(",").map(id => Number(id.trim())),
    phoneRegex: /([+]?[\d\(\)\-\s]{7,}\d)/
};