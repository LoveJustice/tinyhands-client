import Address2Service from './address2.service';
describe('Address2Service', () => {

  let service;

  beforeEach(() => {
    let $http;
    service = new Address2Service($http);
  });

  describe('function listAddresses', () => {
    let url = 'api/address2/',
        queryParams = 'foo bar baz';
    it(`should call get with '${url}' and '${queryParams}'`, () => {
      spyOn(service, 'get');
      service.listAddresses(queryParams);
      expect(service.get).toHaveBeenCalledWith(url, queryParams);
    });
  });

  describe('function searchAddresses', () => {
    let queryParams = 'foo bar baz';
    it(`should call get with '${queryParams}'`, () => {
      spyOn(service, 'listAddresses');
      service.searchAddresses(queryParams);
      expect(service.listAddresses).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('function loadMoreAddresses', () => {
    let url = 'api/address2/',
        queryParams = 'foo bar baz';
    it(`should call get with '${url}' and '${queryParams}'`, () => {
      spyOn(service, 'get');
      service.loadMoreAddresses(queryParams);
      expect(service.get).toHaveBeenCalledWith(url, queryParams);
    });
  });

  describe('function saveAddress', () => {
    let address = {id: 123},
        url = 'api/address2/' + address.id + '/';
    it(`should call get with '${url}' and '${address}'`, () => {
      spyOn(service, 'get');
      service.saveAddress(queryParams);
      expect(service.get).toHaveBeenCalledWith(url, address);
    });
  });

  describe('function getFuzzyAddress2s', () => {
    let val = 'asdf',
        url = 'api/address2/fuzzy/?vdc=' + val;
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.getFuzzyAddress2s(val);
      expect(service.get).toHaveBeenCalledWith(url);
    });
  });

});
