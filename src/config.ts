import dotenv from "dotenv";

dotenv.config();

const { APP_ID, PUBLIC_KEY, BOT_TOKEN, NODE_ENV, MAIN_CHANNEL } = process.env;

if (!APP_ID || !PUBLIC_KEY || !BOT_TOKEN || !NODE_ENV || !MAIN_CHANNEL ) {
  throw new Error("Missing environment variables");
}

export const AppConfig = {
  APP_ID,
  PUBLIC_KEY,
  BOT_TOKEN,
  NODE_ENV,
  MAIN_CHANNEL
};
