
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

export const next22h22 = function (d){
    d = new Date(d);
    if(d.getHours() > 22 || (d.getHours() === 22 && d.getMinutes() > 22))
        d = dayAfter(d);
    d.setHours(22, 22, 0, 0);
    return d;
}

export const previous22h22 = function (d){
    d = new Date(d);
    if(d.getHours() < 22 || (d.getHours() === 22 && d.getMinutes() < 22))
        d = dayBefore(d);
    d.setHours(22, 22, 0, 0);
    return d;
}

export const nextMinute = function (d){
    const nextMinute = new Date(d);
    nextMinute.setMinutes(d.getMinutes()+1, 0, 0);
    return nextMinute;
}

export const epochDays = function (d){
    return Math.floor(Math.floor(d/8.64e7))
}