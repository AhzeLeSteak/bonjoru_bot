
Date.prototype.dayBefore = function (){
    const dayBefore = new Date(this);
    dayBefore.setDate(this.getDate()-1);
    return dayBefore;
}

Date.prototype.dayAfter = function (){
    const dayAfter = new Date(this);
    dayAfter.setDate(this.getDate()+1);
    return dayAfter;
}

Date.prototype.next22h22 = function (){
    let d = new Date(this);
    if(d.getHours() > 22 || (d.getHours() === 22 && d.getMinutes() > 22))
        d = d.dayAfter();
    d.setHours(22, 22, 0, 0);
    return d;
}

Date.prototype.previous22h22 = function (){
    let d = new Date(this);
    if(d.getHours() < 22 || (d.getHours() === 22 && d.getMinutes() < 22))
        d = d.dayBefore();
    d.setHours(22, 22, 0, 0);
    return d;
}

Date.prototype.nextMinute = function (){
    const nextMinute = new Date(this);
    nextMinute.setMinutes(this.getMinutes()+1, 0, 0);
    return nextMinute;
}

/**
 * Renvoie le nombre de jours écoulées depuis la journée epoch (01/01/1970)
 * @returns {number}
 */
Date.prototype.epochDays = function (){
    return Math.floor(this/8.64e7);
}