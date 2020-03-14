class SearchAddressService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    searchAddresses(addressString) {
        return this.service.$http.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=' + addressString);
    }
    
    getMapKey() {
        return this.service.get(`api/site-settings/google_map_key/`);
    }
}

export default SearchAddressService;