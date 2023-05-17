import {Command} from "./Command";
import {Collection, FetchMessagesOptions, Message, Snowflake, TextChannel, User} from "discord.js";
import "../utils/Date.extension";
import "../utils/Message.extension";

export const Streak: Command = {
    name: 'streak',
    description: 'Comptabilise votre streak actuel',
    type: 1,
    run: async (client, interaction) => {
        //const channel = await interaction.channel.fetch() as TextChannel;
        const channel = (await client.channels.fetch('952560653472759860')) as TextChannel;
        const streak = await getStreakOfUser(channel, interaction.user);
        await interaction.followUp({content: `Streak de ${interaction.user.username}: **${streak.length}**`});
    }
}

const getStreakOfUser = async(channel: TextChannel, user: User) => {
    let start_date = new Date();
    const today_at_2222 = new Date();
    today_at_2222.setHours(22, 22, 0, 0);
    if(start_date <= today_at_2222)
        start_date = start_date.dayBefore();
    start_date.setHours(22, 22, 0, 0);

    let messages = await lots_of_messages_getter(channel, start_date);

    const dates_valides: Date[] = [];
    while(has_correct_message([...messages.values()], user)){
        dates_valides.push(start_date);
        start_date = start_date.dayBefore();
        messages = await lots_of_messages_getter(channel, start_date, messages.last()!.id);
    }

    return dates_valides;
};

const has_correct_message = (messages: Message<true>[], user: User) => {
    return messages
        .filter(m => m.author.id === user.id)
        .some(m => m.is_content_2222())
}

async function lots_of_messages_getter(channel: TextChannel, after: Date, before ?: Snowflake) {
    let sum_messages: Collection<Snowflake, Message<true>> = new Collection<Snowflake, Message<true>>();
    const options: FetchMessagesOptions = {
        limit: 100,
        before
    };
    let last_id;

    while (true) {
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.messages.fetch(options) as Collection<Snowflake, Message<true>>;
        if(messages.size === 0)
            break;
        last_id = messages.last()!.id;
        sum_messages = sum_messages.concat(messages.filter(m => m.created_at_2222()));

        if (messages.last()!.createdAt <= after)
            break;
    }

    return sum_messages;
}
