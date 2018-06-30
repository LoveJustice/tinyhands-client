export default class StaffService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getStaff(stationId = 1) {
        return this.service.get(`api/staff/?border_station=${stationId}`);
    }
}