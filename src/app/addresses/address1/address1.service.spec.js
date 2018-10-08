import Address1Service from './address1.service';

describe('Address1Service', () => {

    let mockBaseService, service;

    beforeEach(() => {
        mockBaseService = jasmine.createSpyObj('mockBaseService', ['get', 'put', 'post']);
        service = new Address1Service(mockBaseService);
    });

    describe('function listAddresses with queryParams', () => {
        let url = 'api/address1/';
        let params = 'test param';
        it(`should call get with '${url}' and '${params}'`, () => {
            service.listAddresses(params);
            expect(mockBaseService.get).toHaveBeenCalledWith(url, params);
        });
    });

    describe('function listAddress1s', () => {
        let url = 'api/address1/';
        it(`should call get with '${url}'`, () => {
            service.listAddress1s();
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function searchAddresses with queryParams', () => {
        let params = 'test param';
        it('should call listAddresses(queryParams)', () => {
            spyOn(service, 'listAddresses');
            service.searchAddresses(params);
            expect(service.listAddresses).toHaveBeenCalledWith(params);
        });
    });

    describe('function loadMoreAddresses with queryParams', () => {
        let url = 'api/address1/';
        let params = 'test param';
        it(`should call get with '${url}' and '${params}'`, () => {
            service.loadMoreAddresses(params);
            expect(mockBaseService.get).toHaveBeenCalledWith(url, params);
        });
    });

    describe('function saveAddress with address', () => {
        let address = { id: 123 };
        let url = 'api/address1/' + address.id + '/';
        it(`should call put with '${url}' and '${address}'`, () => {
            service.saveAddress(address);
            expect(mockBaseService.put).toHaveBeenCalledWith(url, address);
        });
    });
    
    describe('function addAddress with address', () => {
        let address = { id: 123 };
        let url = 'api/address1/';
        it(`should call put with '${url}' and '${address}'`, () => {
            service.addAddress(address);
            expect(mockBaseService.post).toHaveBeenCalledWith(url, address);
        });
    });

    describe('function getFuzzyAddress1s with val', () => {
        let val = 'abcdefg';
        let url = 'api/address1/fuzzy/?address1=' + val;
        it(`should call get with '${url}'`, () => {
            service.getFuzzyAddress1s(val);
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

});
