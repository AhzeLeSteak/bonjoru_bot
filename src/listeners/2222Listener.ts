import {Client, Snowflake, TextChannel} from "discord.js";
import "../utils/Date.extension";

let waiting = new Map<Snowflake, boolean>;
let users = new Map<Snowflake, Set<Snowflake>>;


export default (client: Client) => {
    /**
     * lorsqu'un utilisateur envoie un message valide "2222" à 22h22,
     * on l'ajoute à la liste des utilisateur du channel (map user)
     * Si c'est le premier utilisateur de ce channel à envoyer un 2222,
     * waiting[channelID] passe à true et on programme l'envoie d'un message à 22h23
     */
    client.on('messageCreate', async(message) => {
        if(message.author.bot) return;

        const chanID = message.channelId;
        await message.fetch();

        if(!message.is_content_2222() || !message.created_at_2222())
            return;

        if(!users.has(chanID))
            users.set(chanID, new Set());
        users.get(chanID)!.add(message.author.id);

        if(waiting.get(chanID)) return;

        waiting.set(message.id, true);
        const channel = await message.channel.fetch() as TextChannel;
        setTimeout(() => {
            const tags = [...users.get(chanID)!.values()].map(id => `<@${id}>`);
            channel.send(`GG ${tags.join(' ') !}`);
            waiting.set(chanID, false);
            users.delete(chanID)
        }, message.createdAt.nextMinute().getTime() - message.createdAt.getTime())
    })
}
