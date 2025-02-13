"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { APP_ID, PUBLIC_KEY, BOT_TOKEN, NODE_ENV, MAIN_CHANNEL, APPLICATION_ID } = process.env;
if (!APP_ID || !PUBLIC_KEY || !BOT_TOKEN || !NODE_ENV || !MAIN_CHANNEL || !APPLICATION_ID) {
    throw new Error("Missing environment variables");
}
exports.AppConfig = {
    APP_ID,
    PUBLIC_KEY,
    BOT_TOKEN,
    NODE_ENV,
    MAIN_CHANNEL,
    APPLICATION_ID
};
