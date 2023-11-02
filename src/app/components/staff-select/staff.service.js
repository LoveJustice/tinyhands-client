export default class StaffSelectService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getStaff(stationId) {
        return this.service.get(`api/border-station/${stationId}/staff/`);
    }
}