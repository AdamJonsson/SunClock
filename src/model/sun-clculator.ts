export class SunCalculator {
    public daylightHours: number;
    constructor(
        public date: Date, 
        public latitude: number, 
        public longitude: number
    ){
        this.daylightHours = this.getDaylightHours();
    }


    private getDaylightHours() {
        const dayOfTheYear = this.date.getDay();
        const tmp = Math.asin(
            0.39795 * Math.cos(
                0.2163108 + 2 * Math.atan(
                    0.9671396 * Math.tan(
                        0.00860 * (dayOfTheYear - 186)
                    )
                )
            )
        );
        return 24 - (24 / Math.PI) * Math.acos(
            (Math.sin(0.26667 * Math.PI / 180) + Math.sin(this.latitude * Math.PI/180) * Math.sin(tmp)) / 
            (Math.cos(this.latitude * Math.PI / 180) * Math.cos(tmp))
        )
    }

    /** 1 = 100% Light and 0 = 100% Night */
    public getLightToDarkRatio() {
        return this.daylightHours / 24;
    }

    /** 0 = 12:00, 0.5 = 24:00 */
    public getCurrentTimeInRatio() {
        const secondsDuringOneDay = ( 24 * 60 * 60);
        return this._getSecondToday() / secondsDuringOneDay;
    }

    public getLightTimeInText() {
        return this._convertHoursToHoursAndMinutes(this.daylightHours)
    }

    public getDarkTimeInText() {
        return this._convertHoursToHoursAndMinutes(24 - this.daylightHours);
    }

    private _convertHoursToHoursAndMinutes(hours: number) {
        const intHours = Math.floor(hours);
        const intMinutes = Math.round((hours - intHours) * 60);
        
        return ("0" + intHours).slice(-2) + "h : " + ("0" + intMinutes).slice(-2) + "m";
    }

    private _getSecondToday() {
        return this.date.getHours() * 3600 + this.date.getMinutes() * 60 + this.date.getSeconds();
    }
}