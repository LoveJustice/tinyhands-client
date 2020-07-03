class TallyService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    getSixMonthTally() {
        return this.service.get('api/irfNew/six-month-tally/');
    }
}

export default TallyService;
