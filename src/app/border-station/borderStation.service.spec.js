import BorderStationService from './borderStation.service';

describe('BorderStationService', () => {

  let service;

  beforeEach(() => {
    let $http = null;
    let $q = null;
    service = new BorderStationService($http, $q);
  });


  describe('function constructor', () => {
    it('borderStationId should be 0', () => {
      expect(service.borderStationId).toEqual(0);
    });
  });

  describe('function createBorderStation', () => {
    it('should call post with "api/border-station/" and data', () => {
      spyOn(service, 'post');
      let data = {'test': 'data'};
      service.createBorderStation(data);
      expect(service.post).toHaveBeenCalledWith('api/border-station/', data);
    });
  });

  describe('function createCommitteeMember', () => {
    it('should call post with "api/committee-member" and data', () => {
      spyOn(service, 'post');
      let data = {'test': 'data'};
      service.createCommitteeMember(data);
      expect(service.post).toHaveBeenCalledWith('api/committee-member/', data);
    });
  });

  describe('function createLocation', () => {
    it('should call post with "api/location/" and data', () => {
      spyOn(service, 'post');
      let data = {'test': 'data'};
      service.createLocation(data);
      expect(service.post).toHaveBeenCalledWith('api/location/', data);
    });
  });

  describe('function createStaff', () => {
    it('should call post with "api/staff/" and data', () => {
      spyOn(service, 'post');
      let data = {'test': 'data'};
      service.createStaff(data);
      expect(service.post).toHaveBeenCalledWith('api/staff/', data);
    });
  });

  describe('function createRelationship', () => {
    // TODO
  });

  describe('function getBorderStations', () => {
    it('should call get with "api/border-station/"', () => {
      spyOn(service, 'get');
      service.getBorderStations();
      expect(service.get).toHaveBeenCalledWith('api/border-station/');
    });
  });

  describe('function getCommitteeMembers', () => {
    it('should call get with "api/committee-member/..."', () => {
      spyOn(service, 'get');
      service.getCommitteeMembers('testid');
      expect(service.get).toHaveBeenCalledWith('api/committee-member/?border_station=testid');
    });
  });

  describe('function getDetails', () => {
    it('should call get with "api/border-station/..."', () => {
      spyOn(service, 'get');
      service.getDetails();
      expect(service.get).toHaveBeenCalledWith('api/border-station/' + service.borderStationId + '/');
    });
  });

  describe('function getLocations', () => {
    it('should call get with "api/location/..."', () => {
      spyOn(service, 'get');
      service.getLocations();
      expect(service.get).toHaveBeenCalledWith('api/location/?border_station=' + service.borderStationId);
    });
  });

  describe('function getStaff', () => {
    it('should call get with "api/staff/..."', () => {
      spyOn(service, 'get');
      service.getStaff();
      expect(service.get).toHaveBeenCalledWith('api/staff/?border_station=' + service.borderStationId);
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

  describe('function updateCommitteeMembers', () => {
    it('should call put with api string', () => {
      spyOn(service, 'put');
      let memberId = 10;
      let data = {'test': 'data'};
      service.updateCommitteeMembers(memberId, data);
      expect(service.put).toHaveBeenCalledWith('api/committee-member/' + memberId + '/', data);
    });
  });

  describe('function updateDetails', () => {
    it('should call put with api string', () => {
      spyOn(service, 'put');
      let memberId = 10;
      let data = {'test': 'data'};
      service.updateDetails(memberId, data);
      expect(service.put).toHaveBeenCalledWith('api/border-station/' + memberId + '/', data);
    });
  });

  describe('function updateLocations', () => {
    it('should call put with api string', () => {
      spyOn(service, 'put');
      let locationId = 10;
      let data = {'test': 'data'};
      service.updateLocations(locationId, data);
      expect(service.put).toHaveBeenCalledWith('api/location/' + locationId + '/', data);
    });
  });

  describe('function updateRelationship', () => {
    // TODO
  });

  describe('function updateStaff', () => {
    it('should call put with api string', () => {
      spyOn(service, 'put');
      let staffId = 10;
      let data = {'test': 'data'};
      service.updateLocations(staffId, data);
      expect(service.put).toHaveBeenCalledWith('api/location/' + staffId + '/', data);
    });
  });

});
