
const HEURE_ENVOI = 8;
const URL_SQUIRDLE = 'https://squirdle.fireblend.com/daily.html';
const URL_LOLDLE = 'https://loldle.net';

export const squirdle = async(client) => {
    const channel = (await client.channels.fetch(process.env.CHANNEL_2222_ID));
    send_squirdle(channel);
}

const send_squirdle = (channel) =>  {
    const now = new Date();
    let next_send_date = new Date();
    //next_send_date.setMinutes(now.getMinutes()+1, 0, 0);
    next_send_date.setHours(HEURE_ENVOI, 0, 0, 0);
    if(now > next_send_date)
        next_send_date = next_send_date.dayAfter();

    console.log(`Prochain envoi du lien squirdle: ${next_send_date.toLocaleString()}`)

    setTimeout(() => {
        channel.send(`Bonjoru totu le monde !\nPoru bien commencer la journée :\n${URL_SQUIRDLE}\n${URL_LOLDLE}`)
        send_squirdle(channel)
    }, next_send_date.getTime() - now.getTime())

}