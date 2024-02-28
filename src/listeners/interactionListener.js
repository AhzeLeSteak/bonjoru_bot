import {COMMANDS} from '../commands/commands.js';

export default (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

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
