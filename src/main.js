import {Client} from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

import {readyListener} from './listeners/ready_listener.js';
import messageListener from './listeners/message_listener.js';
import interactionCreate from './listeners/interaction_listener.js'

const root = path.resolve('./.env')
dotenv.config({path: root})

const token = process.env.token;
console.log(`Parsing ${root}`);


const client = new Client({
    intents: [1, 1<<1, 1<<3, 1<<7, 1<<8, 1<<9, 1<<10, 1<<12]
});

readyListener(client);
interactionCreate(client);
messageListener(client);


async function main(){
    await client.login(token);
    console.log(`bonjoru_bot started`);
}


main()
