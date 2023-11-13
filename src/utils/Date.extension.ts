declare global{
    interface Date{
        dayBefore(): Date,
        dayAfter(): Date,
        nextMinute(): Date,
    }
}

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

Date.prototype.nextMinute = function (){
    const nextMinute = new Date(this);
    nextMinute.setMinutes(this.getMinutes()+1, 0, 0);
    return nextMinute;
}