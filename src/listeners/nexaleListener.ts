import {Client, TextChannel} from "discord.js";
import "../utils/Date.extension";

function is_message_quoi(content: string) {
    return ['quoi', 'quoi?', 'oui?'].some(v => v.toLowerCase() === content.replace(' ', '').toLowerCase());
}

export default (client: Client) => {
    client.on('messageCreate', async(message) => {
        if(message.author.bot)
            return;
        await message.fetch();
        if(message.author.id !== process.env.NEXALE_ID || !is_message_quoi(message.content))
            return;
        const channel = await message.channel.fetch() as TextChannel;
        await channel.send(`Je peux jouer à charlotte aux fraises ?`)
    })
}
