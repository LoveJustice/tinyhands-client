export default class IndicatorsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    calculate(country_id) {
        return this.service.get(`api/indicators/${country_id}`);
    }
}