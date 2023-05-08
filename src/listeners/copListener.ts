import {Client, TextChannel} from "discord.js";
import "../utils/Date.extension";

export default (client: Client) => {
    client.on('messageCreate', async(message) => {
        if(message.author.id === client.user?.id)
            return;
        await message.fetch();
        if(!message.is_content_2222() || message.created_at_2222())
            return;
        await message.react(process.env.COP_EMOTE as string)
        await message.reply(`Ah, il semblerait que <@${message.author.id}> soit une merde !`);
        const channel = await message.channel.fetch() as TextChannel;
        await channel.send(`<${process.env.PEEPO_STARE_EMOTE}>`)
    })
}
