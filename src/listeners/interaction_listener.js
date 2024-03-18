import {COMMANDS} from '../commands/commands.js';

import { Interaction, Client } from 'discord.js';

export default (client) => {
    /**
     * @param interaction {Interaction}
     */
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

/**
 * 
 * @param client {Client} 
 * @param interaction {Interaction}
 * @returns 
 */
const handleSlashCommand = async (client, interaction) => {
    const slashCommand = COMMANDS.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        await interaction.followUp({ content: "An error has occurred" });
        return;
    }

    try{
        await interaction.deferReply();
        slashCommand.run(client, interaction);
    }
    catch (e){
        console.error(e);
        await interaction.deleteReply('Une erreur est survenue :( ')
    }
};
