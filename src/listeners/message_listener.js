import copHandler from '../message_handlers/cop_handler.js';
import nexaleHandler from '../message_handlers/nexale_handler.js';
import vingtDeuxHandler from '../message_handlers/vingt_deux_handler.js';
import theGameHandler from '../message_handlers/the_game_handler.js';

const MESSAGE_HANDLERS = [copHandler, nexaleHandler, theGameHandler, vingtDeuxHandler];

/**
 * @param client {Client}
 */
export default (client) => {
    client.on('messageCreate', async(message) => {
        if(message.author.bot || !message.inGuild())
            return;
        await message.fetch();
        MESSAGE_HANDLERS.forEach(h => h(message, client));
    })
}
