import {Client} from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

import {readyListener} from './listeners/readyListener.js';
import messageListener from './listeners/messageListener.js';
import interactionCreate from './listeners/interactionListener.js'

const root = path.resolve('./.env')
dotenv.config({path: root})

const token = process.env.token;
console.log(`Parsing ${root}`);


const client = new Client({
    intents: [1, 1<<1, 1<<3, 1<<9, 1<<10, 1<<12]
});

readyListener(client);
interactionCreate(client);
messageListener(client);

client.login(token);
console.log(`bonjoru_bot started`);
