import {squirdle} from '../cron_task/squirdle.js';
import {COMMANDS} from "../commands/commands.js";
import {Client} from 'discord.js';

/**
 * Set les commande et le statut du bot
 * @param {Client} client 
 */
export const readyListener = (client) => {
    client.on('ready', async() => {
        if(!client.user || !client.application)
            return;
        await client.application.commands.set(COMMANDS);
        client.user.setActivity("/streak");
        console.log(`${client.user.username} is online !`);
        console.log('Commandes disonibles :');
        COMMANDS.forEach(c => console.log(`- ${c.name}`));

        await squirdle(client);
    })
}
