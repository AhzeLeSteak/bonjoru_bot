import {Client} from 'discord.js';

//const errorFileName = 'error.log'

/**
 * 
 * @param e {Error}
 * @param client {Client} 
 */
export async function logError(e, client){
    console.error(e);
    //fs.writeFileSync(errorFileName, e.toString());
    const ahze = await client.users.fetch(process.env.AHZE_ID)
    ahze.send(e.stack.toString());
}