import {ChatInputCommandInteraction, Client, Interaction} from "discord.js";
import {COMMANDS} from "../commands/commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(client, interaction as ChatInputCommandInteraction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
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
    }
};
