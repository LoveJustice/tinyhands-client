export default class StaffService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getStaff(stationId) {
        return this.service.get(`api/border-station/${stationId}/staff/`);
    }
}