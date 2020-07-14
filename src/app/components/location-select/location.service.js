export default class LocationService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getLocation(stationId) {
        return this.service.get(`api/border-station/${stationId}/location/`);
    }
}