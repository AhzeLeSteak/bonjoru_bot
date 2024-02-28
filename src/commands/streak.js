import {dayBefore} from "../utils/Date.extension.js";
import { is_content_2222, created_at_2222 } from "../utils/Message.extension.js";


export const STREAK = {
    name: 'streak',
    description: 'Comptabilise votre streak actuel',
    type: 1,
    run: async (client, interaction) => {
        if(!interaction.channel)
            return;
        const channel = await interaction.channel.fetch();
        //const channel = (await client.channels.fetch(process.env.CHANNEL_2222_ID)) as TextChannel;
        const streak = await getStreakOfUser(channel, interaction.user);
        await interaction.followUp({content: `Streak de ${interaction.user.username}: **${streak.length}**`});
    }
}

export const getStreakOfUser = async(channel, user) => {
    let next22h22 = new Date();
    const today_at_2222 = new Date();
    today_at_2222.setHours(22, 22, 0, 0);
    if(next22h22 <= today_at_2222)
        next22h22 = dayBefore(next22h22);
    next22h22.setHours(22, 22, 0, 0);

    let messages = await get_messages_until(channel, next22h22);

    const dates_valides = [];
    while(has_correct_message(messages, user)){
        dates_valides.push(next22h22);
        next22h22 = dayBefore(next22h22);
        const last_message = messages.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)[0];
        messages = await get_messages_until(channel, next22h22, last_message.id);
    }

    return dates_valides;
};

const has_correct_message = (messages, user) =>
    messages.some(m => m.author.id === user.id && is_content_2222(m) && created_at_2222(m))

async function get_messages_until(channel, until, from) {
    let acc = [];
    const options = {
        limit: 100,
        before: from
    };
    let last_id = '';
    let last_fetched;

    do{
        if (last_id)
            options.before = last_id;

        last_fetched = await channel.messages.fetch(options);
        if(last_fetched.size === 0)
            break;
        last_id = last_fetched.last().id;
        acc.push(...last_fetched.filter(m => m.createdAt >= until).values());

    } while (last_fetched.last().createdAt > until);

    return acc;
}
