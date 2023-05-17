import "../utils/Date.extension";
import "../utils/Message.extension";
import {MessageHandler} from "../listeners/messageListener";

export const theGameHandler: MessageHandler = async(message) => {
    if(Math.ceil(Math.random()*8192) !== 666)
        return;
    await message.reply(`J'ai perdu <${process.env.PEEPO_STARE_EMOTE}>`)
}
