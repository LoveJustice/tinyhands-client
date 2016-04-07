import BaseService from '../base.service'

export default class EventsService extends BaseService {
    constructor($http) {
        'ngInject';
        super();

        this.$http = $http;
    }

    getAll() {
        return this.get(`api/event/all/`);
    }

    getEvent(id) {
        return this.get(`api/event/${id}/`);
    }

    createEvent(id) {
        return this.post(`api/event/${id}/`);
    }

    updateEvent(id) {
        return this.put(`api/event/${id}/`);
    }

    destroyEvent(id) {
        return this.delete(`api/event/${id}/`);
    }

    getDashboard() {
        return this.get(`api/event/feed/dashboard/`);
    }
}
