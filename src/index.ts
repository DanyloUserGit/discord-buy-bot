import { Client, GatewayIntentBits } from "discord.js";
import { setupCommands } from "./bot-interface/commands";
import { setupEventHandlersOlx } from "./bot-interface/olx/olx";
import { setupEventHandlersShafa } from "./bot-interface/shafa/shafa";
import { setupEventHandlersVinted } from "./bot-interface/vinted/vinted";
import { AppConfig } from "./config";


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,          
        GatewayIntentBits.GuildMessages,     
        GatewayIntentBits.MessageContent,    
        GatewayIntentBits.GuildMembers,      
        GatewayIntentBits.GuildPresences     
    ],
    rest: {
        timeout: 60000,
    }
});

setupCommands(client);
setupEventHandlersVinted(client);
setupEventHandlersOlx(client);
setupEventHandlersShafa(client);

client.login(AppConfig.BOT_TOKEN);