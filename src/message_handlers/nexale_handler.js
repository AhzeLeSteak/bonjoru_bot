
function is_message_quoi(content) {
    return ['quoi', 'quoi?', 'oui?'].some(v => v.toLowerCase() === content.replace(' ', '').toLowerCase());
}

export default async(message) => {
    if(message.author.id !== process.env.NEXALE_ID || !is_message_quoi(message.content))
        return;
    const channel = await message.channel.fetch();
    await channel.send(`Je peux jouer à charlotte aux fraises ?`)
}