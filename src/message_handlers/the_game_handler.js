import { Message } from "discord.js";

/**
 * @param message {Message}
 */
export default async(message) => {
    const random = Math.ceil(Math.random()*8192) ;
    console.log(`Randomz ${message.author.username} - ${random}`)
    if(random !== 666)
        return;
    await message.reply(`J'ai perdu <${process.env.PEEPO_STARE_EMOTE}>`)
}
