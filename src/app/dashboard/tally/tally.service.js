class TallyService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getTallyDaysOld() {
        return this.service.get('api/portal/tally/days/').then((data) => {
            // Data should be:
            // {0:{dayOfWeek:'Monday',
            //     interceptions: {<String of StationCode>:<Num of Interceptions>}},
            //  1:{dayOfWeek:'Sunday',
            //     interceptions: {...}},
            // }
            return data;
        }, (error) => {
            window.console.log(error);
        });
    }
    
    getTallyDays(countryId) {
        return this.service.get(`api/irfNew/tally/?country_ids=${countryId}`).then((data) => {
            // Data should be:
            // {0:{dayOfWeek:'Monday',
            //     interceptions: {<String of StationCode>:<Num of Interceptions>}},
            //  1:{dayOfWeek:'Sunday',
            //     interceptions: {...}},
            // }
            return data;
        }, (error) => {
            window.console.log(error);
        });
    }
}

export default TallyService;
