import {Client} from "discord.js";
import {COMMANDS} from "../commands/commands";
import squirdle from "../cron_task/squirdle";

export default (client: Client) => {
    client.on('ready', async() => {
        if(!client.user || !client.application)
            return;
        await client.application.commands.set(COMMANDS);
        client.user.setActivity("/streak");
        console.log(`${client.user.username} is online !`);
        console.log('Commandes disonibles :');
        COMMANDS.forEach(c => console.log(`- ${c.name}`));

        squirdle(client);
    })
}
