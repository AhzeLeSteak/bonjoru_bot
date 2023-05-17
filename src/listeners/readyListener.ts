import {Client} from "discord.js";
import {COMMANDS} from "../commands/commands";

export default (client: Client) => {
    client.on('ready', async() => {
        if(!client.user || !client.application)
            return;
        await client.application.commands.set(COMMANDS);
        client.user.setActivity("/streak");
        console.log(`${client.user.username} is online !`);
        console.log('Commandes disonibles :');
        COMMANDS.forEach(c => console.log(`- ${c.name}`))
    })
}
