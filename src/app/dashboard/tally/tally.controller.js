class TallyController {
    constructor($rootScope, TallyService) {
        'ngInject';

        this.rootScope = $rootScope;
        this.service = TallyService;

        this.days = [];
        this.ytd = 0;
        this.userId = null;

        this.getTallyData(true);
    }

    changeColor(day) {
        if (day.change && !day.seen) {
            return {
                'background-color': 'rgba(255,0,0,0.5)',
                'color': 'white'
            };
        }
    }

    checkDifferences(data) {
        if (this.days.length > 0) {
            for (let i in data.reverse()) {
                let interceptions = data[i].interceptions;
                data[i].change = false;
                data[i].seen = false;
                for (let key in interceptions) {
                    if (interceptions.hasOwnProperty(key)) {
                        if (this.days[i].interceptions[key] !== interceptions[key]) {
                            //data has changed
                            data[i].change = true;
                        } else if (this.days[i].change && !this.days[i].seen) {
                            //data was previously changed but has not been seen
                            data[i].change = true;
                        }
                    }
                }
            }
        } else { //localStorage days is null
            for (let x in data) {
                if (!this.isEmptyObject(data[x].interceptions)) {
                    data[x].change = true;
                    data[x].seen = false;
                }
            }
        }
        this.days = data;
    }

    getDayOfWeek(date) {
        let newDate = window.moment(date);
        let today = window.moment().tz("Asia/Kathmandu");
        if (today.date() === newDate.date()) {
            return 'Today';
        }
        let nameOfDay = newDate.format('dddd');
        return nameOfDay;
    }

    getTallyData(firstCall) {
        return this.service.getTallyDays().then((promise) => {
            let data = promise.data;
            if (firstCall) {
                this.userId = data.id;
                this.ytd = data.ytd;
                this.getTallyLocalStorage();
                this.checkDifferences(data.days);
                window.setInterval(() => { this.getTallyData(); }, 60000);
            } else { //updates
                this.checkDifferences(data.days);
            }
            this.saveTallyLocalStorage();
        });
    }

    getTallyLocalStorage() {
        let oldTally = window.localStorage.getItem('tally-' + this.userId);
        if (oldTally) {
            this.days = JSON.parse(oldTally);
        }
    }

    isEmptyObject(obj) {
        return $.isEmptyObject(obj);
    }

    onMouseLeave(day) {
        day.seen = true;
        this.saveTallyLocalStorage();
    }

    saveTallyLocalStorage() {
        window.localStorage.setItem('tally-' + this.userId, JSON.stringify(this.days));
    }

    sumNumIntercepts(day) {
        let sumInt = 0;
        for (let key in day.interceptions) {
            sumInt += day.interceptions[key];
        }
        return sumInt;
    }
}

export default TallyController;
