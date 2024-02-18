import {Snowflake, TextChannel} from "discord.js";
import {MessageHandler} from "../listeners/messageListener";
import "../utils/Date.extension";
import "../utils/Message.extension";
import {nextMinute} from "../utils/Date.extension";

let waiting = new Map<Snowflake, boolean>;
let users = new Map<Snowflake, Set<Snowflake>>;


export const vingtDeuxHandler: MessageHandler = async(message) => {
    const chanID = message.channelId;

    if(!message.is_content_2222() || !message.created_at_2222())
        return;

    message.react(process.env.NERD_EMOTE as string);

    if(!users.has(chanID))
        users.set(chanID, new Set());
    users.get(chanID)!.add(message.author.id);

    if(waiting.get(chanID)) return;

    waiting.set(message.id, true);
    const channel = await message.channel.fetch() as TextChannel;
    setTimeout(() => {
        if(!users.get(chanID)) return;
        const tags = [...users.get(chanID)!.values()].map(id => `<@${id}>`);
        channel.send(`GG ${tags.join(' ') !}`);
        waiting.set(chanID, false);
        users.delete(chanID)
    }, nextMinute(message.createdAt).getTime() - message.createdAt.getTime())
}
