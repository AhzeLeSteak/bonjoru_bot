import {Client} from "discord.js";
import dotenv from "dotenv";
import path from "path";
import ready from "./listeners/readyListener";
import interactionCreate from "./listeners/interactionListener";
import messageListener from "./listeners/messageListener";

const root = path.resolve(__dirname, '../.env')
dotenv.config({path: root})

const token = process.env.token as string;
console.log(`Parsing ${root}`);


const client = new Client({
    intents: [1, 1<<1, 1<<3, 1<<9, 1<<10, 1<<12]
});

ready(client);
interactionCreate(client);
messageListener(client);

client.login(token);
