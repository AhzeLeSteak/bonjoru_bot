import "../utils/Date.extension";
import {Client, TextChannel} from "discord.js";

const HEURE_ENVOI = 8;
const URL = 'https://squirdle.fireblend.com/daily.html';

export default async(client: Client) => {
    const channel = (await client.channels.fetch(process.env.CHANNEL_2222_ID!)) as TextChannel;
    send_squirdle(channel);
}

const send_squirdle = (channel: TextChannel) =>  {
    const now = new Date();
    let next_send_date = new Date();
    //next_send_date.setMinutes(now.getMinutes()+1, 0, 0);
    next_send_date.setHours(HEURE_ENVOI, 0, 0, 0);
    if(now > next_send_date)
        next_send_date = next_send_date.dayAfter();

    console.log(`Prochain envoi du lien squirdle: ${next_send_date.toLocaleString()}`)

    setTimeout(() => {
        channel.send(`C'est l'heure de Squirdler !\n${URL}`)
        send_squirdle(channel)
    }, next_send_date.getTime() - now.getTime())

}