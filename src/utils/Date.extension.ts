interface Date{
    dayBefore(): Date,
    nextMinute(): Date,
}

Date.prototype.dayBefore = function (){
    const dayBefore = new Date(this);
    dayBefore.setDate(this.getDate()-1);
    return dayBefore;
}

Date.prototype.nextMinute = function (){
    const nextMinute = new Date(this);
    nextMinute.setMinutes(this.getMinutes()+1, 0, 0);
    return nextMinute;
}