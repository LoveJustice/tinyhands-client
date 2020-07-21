class CountriesService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getCountries(queryParams) {
        return this.service.get('api/country/', queryParams);
    }

    saveCountry(country) {
        return this.service.put(`api/country/${country.id}/`, country);
    }

    addCountry(country) {
        return this.service.post('api/country/', country);
    }

    loadMoreCountries(queryParams) {
        return this.service.get('api/country/', queryParams);
    }
    
    getRegions() {
        return this.service.get('api/region/');
    }

}

export default CountriesService;
