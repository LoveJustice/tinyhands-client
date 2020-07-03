class TallyController {
    constructor($rootScope, TallyService) {
        'ngInject';

        this.rootScope = $rootScope;
        this.service = TallyService;

        this.tally = null;

        this.getTallyData();
    }
    
    getTallyData() {
        this.service.getSixMonthTally().then((promise) => {
            this.tally = promise.data;
        });
    }
    
    toggleShowCountry(region) {
        if (region.showDetail) {
            region.showDetail = false;
        } else {
            region.showDetail = true;
        }
    }
}

export default TallyController;
