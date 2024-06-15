import { Client } from 'discord.js';

import {COMMANDS} from '../commands/commands.js';
import { logError } from '../utils/logError.js';

/**
 * Lance la méthode de gestion des commande lors de la création d'une intéraction
 * @param {Client} client
 */
export default (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

/**
 * Trouve la commande ayant le nom correspondant et l'exécute
 * @param client {Client} 
 * @param interaction {Interaction}
 */
const handleSlashCommand = async (client, interaction) => {
    const slashCommand = COMMANDS.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        await interaction.followUp({ content: "An error has occurred" });
        return;
    }

    try{
        await interaction.deferReply();
        await slashCommand.run(client, interaction);
    }
    catch (e){
        await interaction.followUp('Une erreur est survenue :/');
        logError(e, client);
    }
};
