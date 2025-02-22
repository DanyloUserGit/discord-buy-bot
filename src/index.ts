import { Client, GatewayIntentBits } from "discord.js";
import { setupCommands } from "./bot-interface/commands";
import { setupEventHandlersOlx } from "./bot-interface/olx/olx";
import { setupEventHandlersVinted } from "./bot-interface/vinted/vinted";
import { AppConfig } from "./config";
import { setupEventHandlersShafa } from "./bot-interface/shafa/shafa";

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

// (async ()=>{
//     const shafaParser = new ParserShafaImpl();
//     shafaParser.addFilter({
//         category: "men",
//         subcategory:subcategoryMenShafa[subcategoryMenNamesShafa[0]],
//         brands: [brandsShafa[brandsValuesShafa[1]],brandsShafa[brandsValuesShafa[0]]],
//         price_from: 400,
//         price_to: 1200
//     })
//     const item = await shafaParser.autorun();
//     console.log(item);
// })()
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