import {nextMinute} from '../utils/Date.extension.js';
import {created_at_2222, is_content_2222} from '../utils/Message.extension.js';

let waiting = new Map();
let users = new Map();


export default async(message) => {
    const chanID = message.channelId;

    if(!is_content_2222(message) || !created_at_2222(message))
        return;

    message.react(process.env.NERD_EMOTE);

    if(!users.has(chanID))
        users.set(chanID, new Set());
    users.get(chanID).add(message.author.id);

    if(waiting.get(chanID)) return;

    waiting.set(message.id, true);
    const channel = await message.channel.fetch();
    setTimeout(() => {
        if(!users.get(chanID)) return;
        const tags = [...users.get(chanID).values()].map(id => `<@${id}>`);
        channel.send(`GG ${tags.join(' ')}`);
        waiting.set(chanID, false);
        users.delete(chanID)
    }, nextMinute(message.createdAt).getTime() - message.createdAt.getTime())
}
