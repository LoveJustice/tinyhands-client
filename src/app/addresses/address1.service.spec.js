import Address1Service from './address1.service';

describe('Address1Service', () => {

  let service;

  beforeEach(() => {
    let $http = null;
    service = new Address1Service($http);
  });

  describe('function listAddresses with queryParams', () => {
    let url = 'api/address1/';
    let params = 'test param';
    it(`should call get with '${url}' and '${params}'`, () => {
      spyOn(service, 'get');
      service.listAddresses(params);
      expect(service.get).toHaveBeenCalledWith(url, params);
    });
  });

  describe('function listAddress1s', () => {
    let url = 'api/address1/';
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.listAddress1s();
      expect(service.get).toHaveBeenCalledWith(url);
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
      spyOn(service, 'get');
      service.loadMoreAddresses(params);
      expect(service.get).toHaveBeenCalledWith(url, params);
    });
  });

  describe('function saveAddress with address', () => {
    let address = {id: 123};
    let url = 'api/address1/' + address.id + '/';
    it(`should call put with '${url}' and '${address}'`, () => {
      spyOn(service, 'put');
      service.saveAddress(address);
      expect(service.put).toHaveBeenCalledWith(url, address);
    });
  });

  describe('function getFuzzyAddress1s with val', () => {
    let val = 'abcdefg';
    let url = 'api/address1/fuzzy/?district=' + val;
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.getFuzzyAddress1s(val);
      expect(service.get).toHaveBeenCalledWith(url);
    });
  });

});
