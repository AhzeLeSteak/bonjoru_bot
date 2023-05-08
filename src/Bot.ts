import {Client} from "discord.js";
import dotenv from "dotenv";
import path from "path";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import copListener from "./listeners/copListener";
import nexaleListener from "./listeners/nexaleListener";
import _2222Listener from "./listeners/2222Listener";

const root = path.resolve(__dirname, '../.env')
dotenv.config({path: root})

const token = process.env.token as string;
console.log(`Parsing ${root}`);


const client = new Client({
    intents: [1, 1<<1, 1<<3, 1<<9, 1<<10, 1<<12]
});

ready(client);
interactionCreate(client);
copListener(client);
_2222Listener(client);
nexaleListener(client);

client.login(token);
