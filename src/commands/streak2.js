import {getStreakOfUser} from './streak.js';

export const STREAK2 = {
    name: '2streak',
    description: 'Comptabilise 2 votre 2 streak 2 actuel 2',
    type: 1,
    run: async (client, interaction) => {
        if(!interaction.channel)
            return;
        const channel = await interaction.channel.fetch();
        //const channel = (await client.channels.fetch(process.env.CHANNEL_2222_ID)) as TextChannel;
        const streak = await getStreakOfUser(channel, interaction.user);
        await interaction.followUp({content: `Streak de ${interaction.user.username}: **${pretty2(streak.length)}** (${streak.length})`});
    }
}


function getMaxPowerOfTwo(n){
    let i = 0;
    while(n >> 1 > 0){
        n >>= 1;
        i++;
    }
    return i;
}

function parentheses(n_str){
    return !isNaN(n_str) ? n_str : `(${n_str})`
}

function pretty2(n, level = 0){
    if(n === 0)
        return '2-2'
    if(n === 1)
        return ['2/2', '2^(2-2)'][level%2];
    if(n === 2)
        return '2';
    const powerOfTwo = getMaxPowerOfTwo(n);
    const restant = n - 2**powerOfTwo;
    let res = powerOfTwo > 1 ? `2^${parentheses(pretty2(powerOfTwo, level+1))}` : '2';
    if(restant > 0)
        res += ` + ${pretty2(restant, level+1)}`;
    return res;
}
