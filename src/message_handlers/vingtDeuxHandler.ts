import {Snowflake, TextChannel} from "discord.js";
import {MessageHandler} from "../listeners/messageListener";
import "../utils/Date.extension";
import "../utils/Message.extension";

let waiting = new Map<Snowflake, boolean>;
let users = new Map<Snowflake, Set<Snowflake>>;


export const vingtDeuxHandler: MessageHandler = async(message) => {
    const chanID = message.channelId;

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
}
