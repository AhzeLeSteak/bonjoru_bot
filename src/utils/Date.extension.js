
export const dayBefore = function (d){
    const dayBefore = new Date(d);
    dayBefore.setDate(d.getDate()-1);
    return dayBefore;
}
export const dayAfter = function (d){
    const dayAfter = new Date(d);
    dayAfter.setDate(d.getDate()+1);
    return dayAfter;
}

export const nextMinute = function (d){
    const nextMinute = new Date(d);
    nextMinute.setMinutes(d.getMinutes()+1, 0, 0);
    return nextMinute;
}