import {created_at_2222, is_content_2222} from "../utils/Message.extension.js";


export default async(message) => {
    if(!is_content_2222(message) || created_at_2222(message))
        return;
    await message.react(process.env.COP_EMOTE)
    await message.reply(`Ah, il semblerait que <@${message.author.id}> soit une merde !`);
    const channel = await message.channel.fetch();
    await channel.send(`<${process.env.PEEPO_STARE_EMOTE}>`)
}
