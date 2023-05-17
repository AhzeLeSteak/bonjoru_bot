import {TextChannel} from "discord.js";
import "../utils/Date.extension";
import {MessageHandler} from "../listeners/messageListener";

function is_message_quoi(content: string) {
    return ['quoi', 'quoi?', 'oui?'].some(v => v.toLowerCase() === content.replace(' ', '').toLowerCase());
}

export const nexaleHandler: MessageHandler = async(message) => {
    if(message.author.id !== process.env.NEXALE_ID || !is_message_quoi(message.content))
        return;
    const channel = await message.channel.fetch() as TextChannel;
    await channel.send(`Je peux jouer à charlotte aux fraises ?`)
}