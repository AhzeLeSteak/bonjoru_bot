import "../utils/Date.extension";
import "../utils/Message.extension";
import {MessageHandler} from "../listeners/messageListener";
import { TTScraper } from "tiktok-scraper-ts";
import {TextChannel} from "discord.js";
const TikTokScraper = new TTScraper();

const TIKTOK_URLS = ["https://vm.tiktok.com/", "https://www.tiktok.com/", "https://vm.tiktok.com/", "https://m.tiktok.com/v/"]


export const tiktokHandler: MessageHandler = async(message) => {
    if(!TIKTOK_URLS.some(url => message.content.startsWith(url)))
        return;
    console.log('Downloading tiktok video');
    try{
        const fetchVideo = await TikTokScraper.video(message.content, true); // second argument set to true to fetch the video without watermark
        if(!fetchVideo || !fetchVideo.playURL)
            throw new Error("Video not found");

        const channel = await message.channel.fetch() as TextChannel;
        await message.delete();
        await channel.send(`${message.author.username} a envoyé : ${fetchVideo.playURL}`);
    }
    catch (e){
        console.error(e);
    }
}
