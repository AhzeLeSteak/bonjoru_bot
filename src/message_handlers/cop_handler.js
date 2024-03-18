import '../utils/Message.polyfill.js';

import { Message } from 'discord.js';

/**
 * @param message {Message}
 */
export default async(message) => {
    if(!message.is_content_2222() || message.created_at_2222())
        return;
    await message.react(process.env.COP_EMOTE)
    await message.reply(`Ah, il semblerait que <@${message.author.id}> soit une merde !`);
    const channel = await message.channel.fetch();
    await channel.send(`<${process.env.PEEPO_STARE_EMOTE}>`)
}
