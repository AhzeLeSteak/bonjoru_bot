import '../utils/Date.polyfill.js';
import '../utils/Message.polyfill.js';

import {getStreakOfUsers} from "../utils/calculate_streak.js";
import { Message, Client } from "discord.js";

/**
* @type {string[]}
 */
const channels = [];

/**
 * @param message {Message}
 * @param client {Client}
 */
export default async(message, client) => {
    if(!message.is_content_2222() || !message.created_at_2222())
        return;

    const chanID = message.channelId;
    message.react(process.env.NERD_EMOTE);


    if(!channels.includes(chanID))
        channels.push(chanID);
    else
        return;

    const channel = await message.channel.fetch();
    setTimeout(async() => {
        const bilan = await getBilan(channel, channel.members.map(u => u.id), client, true);
        if(!bilan) return console.error(new Error("SHOULD NOT HAPPEN"));
        channel.send(`GG !\n${bilan}`);
        channels.length = 0;
    }, message.createdAt.nextMinute().getTime() - message.createdAt.getTime() + 2*1000);
}

export async function getBilan(channel, userIds, client, streak_break = false){
    const streak_map = await getStreakOfUsers(channel, userIds, client, streak_break);

    if([...streak_map.values()].every(streak => streak === 0))
        return false

    const streaks = [];
    const users_streak_break = [];
    const sorted_users_ids = [...streak_map.keys()].sort((a, b) => streak_map.get(a) < streak_map.get(b) ? 1 : -1);

    let placement = 0;
    let last_score = -1;

    for(let userId of sorted_users_ids){
        const streak = streak_map.get(userId);
        if(streak < last_score) placement++;
        const prefix = [':first_place: ', ':second_place: ', ':third_place: ', ''][Math.min(3, placement)];
        if(typeof streak !== 'number') return;
        if(streak > 0)
            streaks.push(`${prefix}<@${userId}> : ${streak}`);
        else if(streak === -1)
            users_streak_break.push(userId);
        last_score = streak;
    }

    const summary_broken_streaks = get_summary_broken_streaks(users_streak_break);

    return `Bilan des streaks :\n${streaks.join('\n')}${summary_broken_streaks}`;
}

function get_summary_broken_streaks(usersId){
    if(usersId.length === 0)
        return '';

    let summary_broken_streaks = `\n`;
    for(let i = 0; i < usersId.length; i++){
        if(i > 0)
            summary_broken_streaks += i === usersId.length - 1 ? ' et ' : ' , ';
        summary_broken_streaks += `<@${usersId[i]}>`;
    }
    const plural = usersId.length > 1
    summary_broken_streaks += ' ' + [plural ? '(les merdes)' : '(la merde)', plural ? 'ont' : 'a', 'brisé', plural ? 'leur' : 'sa', 'streak !'].join(' ');
    return summary_broken_streaks;
}