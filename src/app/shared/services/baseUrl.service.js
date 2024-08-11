export default class BaseUrlService {
    constructor($location) {
        'ngInject';

        this.location = $location;
    }

    getReactUrl(path) {
        let baseUrl = '';
        const hostname = this.location.host();

        if (hostname === 'searchlightdata.org') {
            baseUrl = 'https://searchlightdata.org/re/';
        } else if (hostname === 'staging.searchlightdata.org') {
            baseUrl = 'https://staging.searchlightdata.org/re/';
        } else {
            baseUrl = 'http://localhost:5173/re/';
        }

        return baseUrl + path;
    }
}