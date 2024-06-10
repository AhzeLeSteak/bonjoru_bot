import {Client} from 'discord.js';
import copHandler from '../message_handlers/cop_handler.js';
import nexaleHandler from '../message_handlers/nexale_handler.js';
import vingtDeuxHandler from '../message_handlers/vingt_deux_handler.js';
import theGameHandler from '../message_handlers/the_game_handler.js';
import { logError } from '../utils/logError.js';

const MESSAGE_HANDLERS = [copHandler, nexaleHandler, theGameHandler, vingtDeuxHandler];

/**
 * Exécute tous les handlers lors qu'un message est envoyé
 * @param client {Client}
 */
export default (client) => {
    client.on('messageCreate', async(message) => {
        if(message.author.bot || !message.inGuild())
            return;
        await message.fetch();
        MESSAGE_HANDLERS.forEach(async(h)=> {
            try{
                h(message, client);
            }
            catch(e){
                await message.reply(`Une erreur est survenue`);
                logError(e, client);
            }
        });
    })
}
