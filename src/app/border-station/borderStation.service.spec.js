import BorderStationService from './borderStation.service';

describe('BorderStationService', () => {

  let service;

  beforeEach(inject(($http, $q) => {
    service = new BorderStationService($http, $q);
  }));


  describe('function constructor', () => {
    it('borderStationId should be 0', () => {
      expect(service.borderStationId).toEqual(0);
    });
  });

  describe('function createBorderStation with data', () => {
    let url = 'api/border-station/';
    let data = 'abcdef';
    it(`should call post with '${url}' and '${data}'`, () => {
      spyOn(service, 'post');
      service.createBorderStation(data);
      expect(service.post).toHaveBeenCalledWith(url, data);
    });
  });

  describe('function createCommitteeMember with data', () => {
    let url = 'api/committee-member/';
    let data = 'abcdef';
    it(`should call post with '${url}' and '${data}'`, () => {
      spyOn(service, 'post');
      service.createCommitteeMember(data);
      expect(service.post).toHaveBeenCalledWith(url, data);
    });
  });

  describe('function createLocation with data', () => {
    let url = 'api/location/';
    let data = 'abcdef';
    it(`should call post with '${url}' and '${data}'`, () => {
      spyOn(service, 'post');
      service.createLocation(data);
      expect(service.post).toHaveBeenCalledWith(url, data);
    });
  });

  describe('function createStaff with data', () => {
    let url = 'api/staff/';
    let data = 'abcdef';
    it(`should call post with '${url}' and '${data}'`, () => {
      spyOn(service, 'post');
      service.createStaff(data);
      expect(service.post).toHaveBeenCalledWith(url, data);
    });
  });

  describe('function createRelationship', () => {
    // TODO
  });

  describe('function getBorderStations', () => {
    let url = 'api/border-station/';
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.getBorderStations();
      expect(service.get).toHaveBeenCalledWith(url);
    });
  });

  describe('function getCommitteeMembers', () => {
    let borderStationId = 0; // see borderStation.service.js
    let url = 'api/committee-member/?border_station=' + borderStationId;
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.getCommitteeMembers();
      expect(service.get).toHaveBeenCalledWith(url);
    });
  });

  describe('function getCommitteeMembers with bsId', () => {
    let bsId = 123;
    let url = 'api/committee-member/?border_station=' + bsId;
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.getCommitteeMembers(bsId);
      expect(service.get).toHaveBeenCalledWith(url);
    });
  });

  describe('function getDetails', () => {
    let borderStationId = 0; // see borderStation.service.js
    let url = 'api/border-station/' + borderStationId + '/';
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.getDetails();
      expect(service.get).toHaveBeenCalledWith(url);
    });
  });

  describe('function getLocations', () => {
    let borderStationId = 0; // see borderStation.service.js
    let url = 'api/location/?border_station=' + borderStationId;
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.getLocations();
      expect(service.get).toHaveBeenCalledWith(url);
    });
  });

  describe('function getStaff', () => {
    let borderStationId = 0; // see borderStation.service.js
    let url = 'api/staff/?border_station=' + borderStationId;
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.getStaff();
      expect(service.get).toHaveBeenCalledWith(url);
    });
  });

  describe('function getStaff with bsId', () => {
    let bsId = 123;
    let url = 'api/staff/?border_station=' + bsId;
    it(`should call get with '${url}'`, () => {
      spyOn(service, 'get');
      service.getStaff(bsId);
      expect(service.get).toHaveBeenCalledWith(url);
    });
  });

 describe('function removeRelationship', () => {
   let currentArray, newArray, newValue, removeArray;

   beforeEach(() => {
     newValue = {
       id: 1,
       border_station: 1,
       name: 'Test Object'
     };
     currentArray = [newValue];
     newArray = [];
     newValue = {};
     removeArray = [];
   });

   it('should remove value from currentArray', () => {
     service.removeRelationship(newValue, newArray, currentArray, removeArray);

     expect(currentArray).toEqual([]);
   });

   it('when value is in newArray remove it from newArray and currentArray', () => {
     // REGION: Data Setup
     newArray = [newValue];
     // ENDREGION: Data Setup

     service.removeRelationship(newValue, newArray, currentArray, removeArray);

     expect(newArray).toEqual([]);
   });

   it('when value is NOT in newArray set border_station property to null', () => {
     service.removeRelationship(newValue, newArray, currentArray, removeArray);

     expect(newValue.border_station).toBeNull();
   });

   it('when value is NOT in newArray should add value to removeArray', () => {
     expect(removeArray).toEqual([]);

     service.removeRelationship(newValue, newArray, currentArray, removeArray);

     expect(removeArray).toEqual([newValue]);
   });
 });

  describe('function setBorderStationIdOfData', () => {
    // TODO
  });

  describe('function updateCommitteeMembers with memberId and data', () => {
    let memberId = 10;
    let url = 'api/committee-member/' + memberId + '/';
    let data = 'abcdef';
    it(`should call put with '${url}' and '${data}'`, () => {
      spyOn(service, 'put');
      service.updateCommitteeMembers(memberId, data);
      expect(service.put).toHaveBeenCalledWith(url, data);
    });
  });

  describe('function updateDetails borderStationId and data', () => {
    let borderStationId = 123;
    let url = 'api/border-station/' + borderStationId + '/';
    let data = 'abcdef';
    it(`should call put with '${url}' and '${data}'`, () => {
      spyOn(service, 'put');
      service.updateDetails(borderStationId, data);
      expect(service.put).toHaveBeenCalledWith(url, data);
    });
  });

  describe('function updateLocations with locationId and data', () => {
    let locationId = 123;
    let url = 'api/location/' + locationId + '/';
    let data = 'abcdef';
    it(`should call put with '${url}' and '${data}'`, () => {
      spyOn(service, 'put');
      service.updateLocations(locationId, data);
      expect(service.put).toHaveBeenCalledWith(url, data);
    });
  });

  describe('function updateRelationship', () => {
    // TODO
  });

  describe('function updateStaff with staffId and data', () => {
    let staffId = 123;
    let url = 'api/staff/' + staffId + '/';
    let data = 'abcdef';
    it(`should call put with '${url}' and '${data}'`, () => {
      spyOn(service, 'put');
      service.updateStaff(staffId, data);
      expect(service.put).toHaveBeenCalledWith(url, data);
    });
  });

});
