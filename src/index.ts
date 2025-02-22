import { Client, GatewayIntentBits } from "discord.js";
import { setupCommands } from "./bot-interface/commands";
import { setupEventHandlersOlx } from "./bot-interface/olx/olx";
import { setupEventHandlersVinted } from "./bot-interface/vinted/vinted";
import { AppConfig } from "./config";
import { ParserOlxIml } from "./parser/parser-olx/impl";
import { categoryOlx, subcategoryMenOlx } from "./parser/parser-olx/contracts/types";

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


client.login(AppConfig.BOT_TOKEN);

// olxParser.addFilter({
//     nav:{
//         category: categoryOlx["Чоловічий одяг"],
//         subcategory: subcategoryMenOlx["Майки та футболки"]
//     }
// })

// olxParser.setFilterVal({
//     price: {from: 100, to: 500},
//     brand:['Adidas']
// })

// olxParser.autorun();