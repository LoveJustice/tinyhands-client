import Address2Service from './address2.service';
describe('Address2Service', () => {

  let service, mockBaseService;

  beforeEach(() => {
    mockBaseService = jasmine.createSpyObj('mockBaseService', ['get', 'put'])
    service = new Address2Service(mockBaseService);
  });

  describe('function listAddresses', () => {
    let url = 'api/address2/',
        queryParams = 'foo bar baz';
    it(`should call get with '${url}' and '${queryParams}'`, () => {
      service.listAddresses(queryParams);
      expect(mockBaseService.get).toHaveBeenCalledWith(url, queryParams);
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
      service.loadMoreAddresses(queryParams);
      expect(mockBaseService.get).toHaveBeenCalledWith(url, queryParams);
    });
  });

  describe('function saveAddress', () => {
    let address = {id: 123},
        url = 'api/address2/' + address.id + '/';
    it(`should call get with '${url}' and '${address}'`, () => {
      service.saveAddress(address);
      expect(mockBaseService.put).toHaveBeenCalledWith(url, address);
    });
  });

  describe('function getFuzzyAddress2s', () => {
    let val = 'asdf',
        url = 'api/address2/fuzzy/?vdc=' + val;
    it(`should call get with '${url}'`, () => {
      service.getFuzzyAddress2s(val);
      expect(mockBaseService.get).toHaveBeenCalledWith(url);
    });
  });

});
