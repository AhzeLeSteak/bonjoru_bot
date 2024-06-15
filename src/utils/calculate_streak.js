import {Client, Message, TextChannel} from 'discord.js';

import './Date.polyfill.js';
import './Message.polyfill.js';

/**
 * @typedef {{date: Date,map: Map<string, number>}} Bilan
 */


/**
 * Retourne la streak d'un utilisateur pour un channel donnée
 * @param {TextChannel} channel 
 * @param {string} userId 
 * @param {Client} client 
 * @returns {number}
 */
export const getStreakOfUser = async(channel, userId, client) => {
    const streak = await getStreakOfUsers(channel, [userId], client, false);
    return streak.get(userId);
}


/**
 * Retourne la streaks des utilisateurs, pour le channel donné, sous forme de map
 * @param {TextChannel} channel 
 * @param {string[]} userIds 
 * @param {Client} client 
 * @param {boolean} count_streak_break Indique si on inclue les utilisateurs ayant brisé leur streak, dans quel cas elle vaudra -1
 * @returns {Map<string, number>} map user id -> streak
 */
export async function getStreakOfUsers(channel, userIds, client, count_streak_break = false) {
    const {bilan, messages} = await get_last_2222_messages_of_users(channel, userIds, client);
    return calculateStreak(userIds, bilan, messages, count_streak_break);
}


/**
 * Fetch et renvoie les messages dans un channel donné, pour les utilisateurs données
 * jusqu'à là date où aucun des utilisateurs n'a envoyé de message 22h22-valide
 * ou jusqu'à ce que l'on trouve un bilan
 * @param {TextChannel} channel 
 * @param {string[]} userIds 
 * @param {Client} client 
 * @returns 
 */
async function get_last_2222_messages_of_users(channel, userIds, client){
    const today_at_2222 = new Date();
    today_at_2222.setHours(22, 22, 0, 0);

    let previous22h22 = new Date().previous22h22();

    let last_messages = await get_messages_until(channel, previous22h22);
    let messages = [...last_messages];
    let bilan = null;

    //tant qu'au moins un utilisateur du tableau utilisateur à un message 22h22 valide dans les messages fetched
    while (has_correct_message(last_messages, userIds)) {
        bilan = get_bilan(last_messages, client);
        if(bilan){
            messages = messages.filter(m => m.createdAt > bilan.date);
            break;
        }

        userIds = userIds.filter(id => has_correct_message(last_messages, [id])); //filtrage des utilisateurs qui n'ont pas de message valide
        previous22h22 = previous22h22.dayBefore();
        const last_message = last_messages.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).shift();
        last_messages = await get_messages_until(channel, previous22h22, last_message.id); // fetch les messages jusqu'à 22h22 la veille
        messages = [...messages, ...last_messages];
    }
    messages = messages.filter(m => m.is_2222_valid());
    return {bilan, messages};
}

/**
 * Indique si le tableau contient au moins un message créé par l'un des utilisateurs et étant 22h22-valide
 * @param {Message<true>[]} messages 
 * @param {string[]} userIds 
 * @returns {boolean}
 */
const has_correct_message = (messages, userIds) =>
    messages.some(m => userIds.includes(m.author.id) && m.is_2222_valid());


/**
 * Cherche un bilan envoyé par bonjoru dans les messages passés en paramètre
 * S'il y en a un, on le parse pour obtenir les streaks des utilisateurs
 * @param {Message<true>[]} messages 
 * @param {Client} client 
 * @returns {Bilan |false} bilan
 */
function get_bilan(messages, client) {
    const bilan = messages.find(message => message.author.id === client.user.id && message.content.toLowerCase().includes("bilan"));
    if(!bilan) return false;
    
    const streakMap = new Map();
    for(let [_, userId, streak] of bilan.content.matchAll(/<@(\d+)> : (\d+)/gm))
        streakMap.set(userId, +streak);
    return {
        date: bilan.createdAt,
        map: streakMap
    }
}

/**
 * Fetch et renvoie la liste de tous les messages du channel créés
 * de la date actuelle au dernier 22h22 (de manière antéchronologique)
 * Si l'argument from est précisé, on ne part pas de la date actuelle
 * mais du message ayant cet id  
 * @param {TextChannel} channel Le channel sur lequel fetch les message
 * @param {Date} until La date min pour les message à fetch
 * @param {string} from L'id du message de départ (facultatif) 
 * @returns {Promise<Message<true>[]>}
 */
async function get_messages_until(channel, until, from = undefined) {
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


/**
 * Calcule la streak des utilisateurs selon une liste de message et un bilan
 * @param {string[]} usersId 
 * @param {Bilan | false} bilan Dernier bilan de streak (faux si aucun bilan existant)
 * @param {Message<true>[]} messages Liste des messages des utilisateurs
 * @param {boolean} count_streak_break Indique si on inclue les utilisateurs ayant brisé leur streak, dans quel cas elle vaudra -1
 * @returns {Map<string, number>} 
 */
function calculateStreak(usersId, bilan, messages, count_streak_break = false){
    /** @type Map<string, number> */
    const streakMap = new Map();
    usersId.forEach(id => streakMap.set(id, 0));

    if(messages.length === 0 && !bilan) return streakMap;
    
    messages.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
    const oldest_date_index = (bilan ? bilan.date : messages[0].createdAt).previous22h22().epochDays();
   
    for(let userId of usersId){
        
        // Pour chaque utilisateur, on map ses messages à un leur epochDay
        // E.g. [17/08, 18/08, 19/08] devient [16342, 16343, 16344]
        const user_messages_indexes = messages.filter(m => m.author.id === userId)
                                               .map(m => m.createdAt.epochDays());
        let streak = 0;
        const start_date = new Date().previous22h22().epochDays();
        let travel_date = start_date;

        // On part de l'epochDay de la date actuelle, et on décrément tant qu'il est compris dans le tableau user_messages_indexes
        while(user_messages_indexes.includes(travel_date)){
            streak++;
            travel_date--;
        }
        
        // Si on a décrémenté jusqu'à la date la plus vielle et qu'un bilan existen on ajoute le score du bilan au streak
        if(travel_date === oldest_date_index && bilan && bilan.map.has(userId))
            streak += bilan.map.get(userId);
        
        // Si arrivé ici la streak vaut zero, on regarde si l'utilisateur avait une streak la veille, dans quel cas elle est brisée
        if(count_streak_break && streak === 0){
            let is_streak_broken = false;
            if(bilan && oldest_date_index === start_date - 1)
                is_streak_broken = bilan.map.has(userId) && bilan.map.get(userId) > 0;
            else
                is_streak_broken = user_messages_indexes.includes(start_date - 1);
            if(is_streak_broken)
                streak = -1;
        }

        streakMap.set(userId, streak);
    }
    return streakMap;
}