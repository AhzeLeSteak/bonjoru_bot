export const created_at_2222 = function (message){
    const created_at = message.createdAt;
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

export const is_content_2222 = function(message){
    return ACCEPTED_MESSAGES.includes(message.content.replace(" ", ""))
}
