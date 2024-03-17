import {getBilan} from '../message_handlers/vingtDeuxHandler.js';

export const STREAK_ALL = {
    name: 'streak_all',
    description: 'Comptabilise la streak de tous les utilisateurs',
    type: 1,
    run: async (client, interaction) => {
        if(!interaction.channel)
            return;
        const channel = await interaction.channel.fetch();
        //const channel = (await client.channels.fetch(process.env.CHANNEL_2222_ID));
        const users = channel.members;
        let bilan = await getBilan(channel, users.map(u => u.id), client);
        if(!bilan)
            bilan = 'Ah, on dirait que totu le monde est un peu nul :/';
        await interaction.followUp({content: bilan});
    }
}