export const GENERATE_ERROR = {
    name: 'error',
    description: 'Génère une erreur - TEST',
    type: 1,
    run: async (client, interaction) => {
        throw new Error('AAAAAA');
    }
}