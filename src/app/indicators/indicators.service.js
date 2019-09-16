export default class IndicatorsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }
    
    calculate(params) {
        return this.service.get('api/indicators/', params);
    }
}