import {nextMinute} from '../utils/Date.extension.js';
import {created_at_2222, is_content_2222} from '../utils/Message.extension.js';
import {getStreakOfUsers} from "../utils/calculate_streak.js";

/**
* @type {Map<string, Set<EmbedAuthorData>>}
 */
let chanToUsers = new Map();


export default async(message, client) => {
    if(!is_content_2222(message) || !created_at_2222(message))
        return;

    const chanID = message.channelId;
    message.react(process.env.NERD_EMOTE);

    const isChanProcessed = chanToUsers.has(chanID);

    if(!isChanProcessed)
        chanToUsers.set(chanID, new Set());
    chanToUsers.get(chanID).add(message.author.id);

    if(isChanProcessed)
        return;

    const channel = await message.channel.fetch();
    setTimeout(async() => {
        if(!chanToUsers.get(chanID)) return;
        const bilan = await getBilan(channel, [...chanToUsers.get(chanID).values()], client);
        if(!bilan) return console.error(new Error("SHOULD NOT HAPPEN"));
        channel.send(`GG !\n${bilan}`);
        chanToUsers.delete(chanID)
    }, nextMinute(message.createdAt).getTime() - message.createdAt.getTime())
}

export async function getBilan(channel, userIds, client){
    const res = await getStreakOfUsers(channel, userIds, client);
    if([...res.values()].every(streak => streak === 0))
        return false
    const tags = [...res.keys()]
        .filter(userId => res.get(userId))
        .map(userId => `<@${userId}> : ${res.get(userId)}`)
    return `Bilan des streaks :\n${tags.join('\n')}`;
}