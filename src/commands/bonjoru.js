export const BONJORU = {
    name: 'bonjoru',
    description: 'Commande de test',
    type: 1,
    run: async (client, interaction) => {
        await interaction.followUp({content: 'Bonjoru !'});
    }
}