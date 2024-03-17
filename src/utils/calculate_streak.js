import './Date.polyfill.js';
import './Message.polyfill.js';


export const getStreakOfUser = async(channel, userId, client) => {
    const streak = await getStreakOfUsers(channel, [userId], client);
    return streak.get(userId);
}


export async function getStreakOfUsers(channel, userIds, client) {
    const {bilan, messages} = await get_last_2222_messages_of_users(channel, userIds, client);
    return calculateStreak(userIds, bilan, messages);
}


async function get_last_2222_messages_of_users(channel, userIds, client){
    let next22h22 = new Date();
    const today_at_2222 = new Date();
    today_at_2222.setHours(22, 22, 0, 0);
    if (next22h22 <= today_at_2222)
        next22h22 = next22h22.dayBefore();
    next22h22.setHours(22, 22, 0, 0);

    let last_messages = await get_messages_until(channel, next22h22);
    let messages = [...last_messages];
    let bilan = null;

    //tant qu'au moins un utilisateur du tableau utilisateur à un message 22h22 valide dans les messages fetched
    while (has_correct_message(last_messages, userIds)) {
        bilan = get_bilan(last_messages, userIds, client);
        if(bilan){
            messages = messages.filter(m => m.createdAt > bilan.date);
            break;
        }

        userIds = userIds.filter(id => has_correct_message(last_messages, [id])); //filtrage des utilisateurs qui n'ont pas de message valide
        next22h22 = next22h22.dayBefore();
        const last_message = last_messages.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).shift();
        last_messages = await get_messages_until(channel, next22h22, last_message.id); // fetch les messages jusqu'à 22h22 la veille
        messages = [...messages, ...last_messages];
    }
    messages = messages.filter(m => m.is_2222_valid());
    return {bilan, messages};
}

/**
* @param messages
* @param userIds {string[]}
*/
const has_correct_message = (messages, userIds) =>
    messages.some(m => userIds.includes(m.author.id) && m.is_2222_valid());

function get_bilan(messages, userIds, client) {
    const bilan = messages.find(message => message.author.id === client.user.id && message.content.toLowerCase().includes("bilan"));
    if(bilan){
        const streakMap = new Map();
        for(let [_, userId, streak] of bilan.content.matchAll(/<@(\d+)> : (\d+)/gm))
            streakMap.set(userId, +streak);
        return {
            date: bilan.createdAt,
            map: streakMap
        }
    }
    return false;
}

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

function calculateStreak(usersId, bilan, messages){
    messages.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
    const oldest_date_index = (bilan ? bilan.date : messages[0].createdAt).previous22h22().epochDays();
    const streakMap = new Map();
    for(let userId of usersId){
        const user_messages_indexes = messages.filter(m => m.author.id === userId)
                                               .map(m => m.createdAt.epochDays());
        let streak = 0;
        let start_date = new Date().previous22h22().epochDays();
        while(user_messages_indexes.includes(start_date)){
            streak++;
            start_date--;
        }
        
        if(start_date === oldest_date_index && bilan && bilan.map.has(userId))
            streak += bilan.map.get(userId);
        
        streakMap.set(userId, streak);
    }
    return streakMap;
}