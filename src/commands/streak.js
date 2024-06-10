import {getStreakOfUser} from "../utils/calculate_streak.js";

export const STREAK = {
    name: 'streak',
    description: 'Comptabilise votre streak actuel',
    type: 1,
    run: async (client, interaction) => {
        if(!interaction.channel)
            return;
        const channel = await interaction.channel.fetch();
        //const channel = (await client.channels.fetch(process.env.CHANNEL_2222_ID)) as TextChannel;
        const streak = await getStreakOfUser(channel, interaction.user.id, client);
        await interaction.followUp({content: `Streak de ${interaction.user.username}: **${streak}**`});
    }
}
