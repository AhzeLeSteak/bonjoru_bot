import {Command} from "./Command";


export const Bonjoru: Command = {
    name: 'bonjoru',
    description: 'Commande de test',
    type: 1,
    run: async (client, interaction) => {
        await interaction.followUp({content: 'Bonjoru !'});
    }
}