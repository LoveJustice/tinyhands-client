(function() {
  'use strict';

  var service;

  describe('BorderStationService', function() {

    beforeEach(module('tinyhandsFrontend'));

    beforeEach(inject(function($injector) {
      service = $injector.get('BorderStationService');
    }));


    describe('function constructor', function() {
      it('borderStationId should be 0', function() {
        expect(service.borderStationId).toEqual(0);
      });
    });

    describe('function createBorderStation', function() {
      it('should call post with "api/border-station/" and data', function() {
        spyOn(service, 'post');
        var data = {'test': 'data'};
        service.createBorderStation(data);
        expect(service.post).toHaveBeenCalledWith('api/border-station/', data);
      });
    });

    describe('function createCommitteeMember', function() {
      it('should call post with "api/committee-member" and data', function() {
        spyOn(service, 'post');
        var data = {'test': 'data'};
        service.createCommitteeMember(data);
        expect(service.post).toHaveBeenCalledWith('api/committee-member/', data);
      });
    });
    
    describe('function createLocation', function() {
      it('should call post with "api/location/" and data', function() {
        spyOn(service, 'post');
        var data = {'test': 'data'};
        service.createLocation(data);
        expect(service.post).toHaveBeenCalledWith('api/location/', data);
      });
    });

    describe('function createStaff', function() {
      it('should call post with "api/staff/" and data', function() {
        spyOn(service, 'post');
        var data = {'test': 'data'};
        service.createStaff(data);
        expect(service.post).toHaveBeenCalledWith('api/staff/', data);
      });
    });

    describe('function createRelationship', function() {
      // TODO
    });

    describe('function getBorderStations', function() {
      it('should call get with "api/border-station/"', function() {
        spyOn(service, 'get');
        service.getBorderStations();
        expect(service.get).toHaveBeenCalledWith('api/border-station/');
      });
    });

    describe('function getCommitteeMembers', function() {
      it('should call get with "api/committee-member/..."', function() {
        spyOn(service, 'get');
        service.getCommitteeMembers('testid');
        expect(service.get).toHaveBeenCalledWith('api/committee-member/?border_station=testid');
      });
    });

    describe('function getDetails', function() {
      it('should call get with "api/border-station/..."', function() {
        spyOn(service, 'get');
        service.getDetails();
        expect(service.get).toHaveBeenCalledWith('api/border-station/' + service.borderStationId + '/');
      });
    });

    describe('function getLocations', function() {
      it('should call get with "api/location/..."', function() {
        spyOn(service, 'get');
        service.getLocations();
        expect(service.get).toHaveBeenCalledWith('api/location/?border_station=' + service.borderStationId);
      });
    });
    
    describe('function getStaff', function() {
      it('should call get with "api/staff/..."', function() {
        spyOn(service, 'get');
        service.getStaff();
        expect(service.get).toHaveBeenCalledWith('api/staff/?border_station=' + service.borderStationId);
      });
    });

   describe('function removeRelationship', function() {
     var currentArray, newArray, newValue, removeArray;
     
     beforeEach(function() {
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
     
     it('should remove value from currentArray', function() {
       service.removeRelationship(newValue, newArray, currentArray, removeArray);
       
       expect(currentArray).toEqual([]);
     });
     
     it('when value is in newArray remove it from newArray and currentArray', function() {
       // REGION: Data Setup
       newArray = [newValue];
       // ENDREGION: Data Setup
       
       service.removeRelationship(newValue, newArray, currentArray, removeArray);
       
       expect(newArray).toEqual([]);
     });
     
     it('when value is NOT in newArray set border_station property to null', function() {
       service.removeRelationship(newValue, newArray, currentArray, removeArray);
       
       expect(newValue.border_station).toBeNull();
     });
     
     it('when value is NOT in newArray should add value to removeArray', function() {
       expect(removeArray).toEqual([]);
       
       service.removeRelationship(newValue, newArray, currentArray, removeArray);
       
       expect(removeArray).toEqual([newValue]);
     });
   });

    describe('function setBorderStationIdOfData', function() {
      // TODO
    });

    describe('function updateCommitteeMembers', function() {
      it('should call put with api string', function() {
        spyOn(service, 'put');
        var memberId = 10;
        var data = {'test': 'data'};
        service.updateCommitteeMembers(memberId, data);
        expect(service.put).toHaveBeenCalledWith('api/committee-member/' + memberId + '/', data);
      });
    });

    describe('function updateDetails', function() {
      it('should call put with api string', function() {
        spyOn(service, 'put');
        var memberId = 10;
        var data = {'test': 'data'};
        service.updateDetails(memberId, data);
        expect(service.put).toHaveBeenCalledWith('api/border-station/' + memberId + '/', data);
      });
    });

    describe('function updateLocations', function() {
      it('should call put with api string', function() {
        spyOn(service, 'put');
        var locationId = 10;
        var data = {'test': 'data'};
        service.updateLocations(locationId, data);
        expect(service.put).toHaveBeenCalledWith('api/location/' + locationId + '/', data);
      });
    });

    describe('function updateRelationship', function() {
      // TODO
    });

    describe('function updateStaff', function() {
      it('should call put with api string', function() {
        spyOn(service, 'put');
        var staffId = 10;
        var data = {'test': 'data'};
        service.updateLocations(staffId, data);
        expect(service.put).toHaveBeenCalledWith('api/location/' + staffId + '/', data);
      });
    });

  });


})();
