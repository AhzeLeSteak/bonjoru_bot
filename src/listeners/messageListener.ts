import {Client, Message} from "discord.js";
import "../utils/Date.extension";
import {copHandler} from "../message_handlers/copHandler";
import {nexaleHandler} from "../message_handlers/nexaleHandler";
import {vingtDeuxHandler} from "../message_handlers/vingtDeuxHandler";
import {theGameHandler} from "../message_handlers/theGameHandler";
import {tiktokHandler} from "../message_handlers/tiktokHandler";

export type MessageHandler = (m: Message) => Promise<void>;
const MESSAGE_HANDLERS: MessageHandler[] = [copHandler, nexaleHandler, theGameHandler, tiktokHandler, vingtDeuxHandler];

export default (client: Client) => {
    client.on('messageCreate', async(message) => {
        if(message.author.bot || !message.inGuild())
            return;
        await message.fetch();
        MESSAGE_HANDLERS.forEach(h => h(message));
    })
}
