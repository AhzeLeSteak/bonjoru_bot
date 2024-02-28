import {TextChannel} from "discord.js";
import "../utils/Date.extension";
import "../utils/Message.extension";
import {MessageHandler} from "../listeners/messageListener";

export const copHandler: MessageHandler = async(message) => {
    if(!message.is_content_2222() || message.created_at_2222())
        return;
    await message.react(process.env.COP_EMOTE as string)
    await message.reply(`Ah, il semblerait que <@${message.author.id}> soit une merde !`);
    const channel = await message.channel.fetch() as TextChannel;
    await channel.send(`<${process.env.PEEPO_STARE_EMOTE}>`)
}
