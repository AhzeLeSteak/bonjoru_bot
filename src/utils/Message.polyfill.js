import {Message} from "discord.js";

Message.prototype.created_at_2222 = function (){
    const created_at = this.createdAt;
    const min = new Date(created_at);
    min.setHours(22, 22, 0, 0);
    const max = new Date(created_at);
    max.setHours(22, 23, 0, 0);
    return min <= created_at && created_at <= max;
}


const ACCEPTED_MESSAGES = [
    '2222',
    '22:22',
    '22h22',
];

Message.prototype.is_content_2222 = function(){
    return ACCEPTED_MESSAGES.includes(this.content.replace(" ", ""))
}

Message.prototype.is_2222_valid = function(){
    return this.is_content_2222() && this.created_at_2222();
}