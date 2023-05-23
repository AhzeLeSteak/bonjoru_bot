import {Command} from "./Command";
import {Collection, FetchMessagesOptions, Message, Snowflake, TextChannel, User} from "discord.js";
import "../utils/Date.extension";
import "../utils/Message.extension";

export const Streak: Command = {
    name: 'streak',
    description: 'Comptabilise votre streak actuel',
    type: 1,
    run: async (client, interaction) => {
        if(!interaction.channel)
            return;
        const channel = await interaction.channel.fetch() as TextChannel;
        //const channel = (await client.channels.fetch('process.env.CHANNEL_2222_ID')) as TextChannel;
        const streak = await getStreakOfUser(channel, interaction.user);
        await interaction.followUp({content: `Streak de ${interaction.user.username}: **${streak.length}**`});
    }
}

const getStreakOfUser = async(channel: TextChannel, user: User) => {
    let next22h22 = new Date();
    const today_at_2222 = new Date();
    today_at_2222.setHours(22, 22, 0, 0);
    if(next22h22 <= today_at_2222)
        next22h22 = next22h22.dayBefore();
    next22h22.setHours(22, 22, 0, 0);

    let messages = await get_messages_until(channel, next22h22);

    const dates_valides: Date[] = [];
    while(has_correct_message(messages, user)){
        dates_valides.push(next22h22);
        next22h22 = next22h22.dayBefore();
        const last_message = messages.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)[0];
        messages = await get_messages_until(channel, next22h22, last_message.id);
    }

    return dates_valides;
};

const has_correct_message = (messages: Message<true>[], user: User) =>
    messages.some(m => m.author.id === user.id && m.is_content_2222())

async function get_messages_until(channel: TextChannel, until: Date, from ?: Snowflake) {
    let acc: Message<true>[] = [];
    const options: FetchMessagesOptions = {
        limit: 100,
        before: from
    };
    let last_id: Snowflake = '';
    let last_fetched: Collection<Snowflake, Message<true>>;

    do{
        if (last_id)
            options.before = last_id;

        last_fetched = await channel.messages.fetch(options) as typeof last_fetched;
        if(last_fetched.size === 0)
            break;
        last_id = last_fetched.last()!.id;
        acc.push(...last_fetched.filter(m => m.createdAt >= until).values());

    } while ((last_fetched.last()!.createdAt > until));

    return acc;
}
