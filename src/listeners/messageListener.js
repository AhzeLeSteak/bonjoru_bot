import copHandler from '../message_handlers/copHandler.js';
import nexaleHandler from '../message_handlers/nexaleHandler.js';
import vingtDeuxHandler from '../message_handlers/vingtDeuxHandler.js';
import theGameHandler from '../message_handlers/theGameHandler.js';

const MESSAGE_HANDLERS = [copHandler, nexaleHandler, theGameHandler, vingtDeuxHandler];

export default (client) => {
    client.on('messageCreate', async(message) => {
        if(message.author.bot || !message.inGuild())
            return;
        await message.fetch();
        MESSAGE_HANDLERS.forEach(h => h(message));
    })
}
