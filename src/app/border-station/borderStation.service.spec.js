import BorderStationService from './borderStation.service';

describe('BorderStationService', () => {

    let service, mockBaseService;

    let data = 'abcdef',
        borderStationId = 0, // see borderStation.service.js
        bsId = 123,
        locationId = 123,
        staffId = 123;

    beforeEach(() => {
        let $q;
        mockBaseService = jasmine.createSpyObj('mockBaseService', ['get', 'put', 'post']);
        service = new BorderStationService(mockBaseService, $q);
    });


    describe('function constructor', () => {
        it('borderStationId should be 0', () => {
            expect(service.borderStationId).toEqual(0);
        });
    });

    describe('function createBorderStation with data', () => {
        let url = 'api/border-station/';
        it(`should call post with '${url}' and '${data}'`, () => {
            service.createBorderStation(data);
            expect(mockBaseService.post).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function createCommitteeMember with data', () => {
        let url = 'api/committee-member/';
        it(`should call post with '${url}' and '${data}'`, () => {
            service.createCommitteeMember(data);
            expect(mockBaseService.post).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function createLocation with data', () => {
        let url = 'api/location/';
        it(`should call post with '${url}' and '${data}'`, () => {
            service.createLocation(data);
            expect(mockBaseService.post).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function createStaff with data', () => {
        let url = 'api/staff/';
        it(`should call post with '${url}' and '${data}'`, () => {
            service.createStaff(data);
            expect(mockBaseService.post).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function createRelationship', () => {

        let deferred = {
            resolve: () => { },
            promise: 'foo',
        };

        beforeEach(() => {
            service.$q = { defer: () => { return deferred; } };
            mockBaseService.post.and.callFake(() => {
                return {
                    then: (f) => {
                        f({ data: 'foo' });
                    }
                };
            });
        });

        it("should call createBorderStation with 'bar' if createApiFunction is 'createBorderStation'", () => {
            spyOn(service, 'createBorderStation').and.callThrough();
            service.createRelationship(['bar'], 'createBorderStation');
            expect(service.createBorderStation).toHaveBeenCalledWith('bar');
        });

        it("should call createStaff with 'bar' if createApiFunction is 'createStaff'", () => {
            spyOn(service, 'createStaff').and.callThrough();
            service.createRelationship(['bar'], 'createStaff');
            expect(service.createStaff).toHaveBeenCalledWith('bar');
        });

        let finishedCallsMessage = 'Finished sending create calls';
        it(`should call deferred.resolve with ${finishedCallsMessage} if createArray not empty`, () => {
            spyOn(deferred, 'resolve');
            service.createRelationship([1, 2, 3], 'createBorderStation');
            expect(deferred.resolve).toHaveBeenCalledWith(finishedCallsMessage);
        });

        let noCallsMessage = 'No create calls needed';
        it(`should call deferred.resolve with ${noCallsMessage} if createArray empty`, () => {
            spyOn(deferred, 'resolve');
            service.createRelationship([], null);
            expect(deferred.resolve).toHaveBeenCalledWith(noCallsMessage);
        });

        it("should return 'foo'", () => {
            expect(service.createRelationship([], null)).toEqual('foo');
        });

    });

    describe('function getBorderStations', () => {
        let url = 'api/border-station/';
        it(`should call get with '${url}'`, () => {
            service.getBorderStations();
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getCommitteeMembers', () => {
        let url = 'api/committee-member/?border_station=' + borderStationId;
        it(`should call get with '${url}'`, () => {
            service.getCommitteeMembers();
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getCommitteeMembers with bsId', () => {
        let url = 'api/committee-member/?border_station=' + bsId;
        it(`should call get with '${url}'`, () => {
            service.getCommitteeMembers(bsId);
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getDetails', () => {
        let url = 'api/border-station/' + borderStationId + '/';
        it(`should call get with '${url}'`, () => {
            service.getDetails();
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getLocations', () => {
        let url = 'api/location/?border_station=' + borderStationId;
        it(`should call get with '${url}'`, () => {
            service.getLocations();
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getStaff', () => {
        let url = 'api/staff/?border_station=' + borderStationId;
        it(`should call get with '${url}'`, () => {
            service.getStaff();
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
        });
    });

    describe('function getStaff with bsId', () => {
        let url = 'api/staff/?border_station=' + bsId;
        it(`should call get with '${url}'`, () => {
            service.getStaff(bsId);
            expect(mockBaseService.get).toHaveBeenCalledWith(url);
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
        let data = [
            { border_station: 1 },
            { border_station: 2 },
            { border_station: 3 }
        ];
        let finalData = [
            { border_station: 123 },
            { border_station: 123 },
            { border_station: 123 }
        ];

        it(`should set ${data} to ${finalData}`, () => {
            service.borderStationId = 123;
            service.setBorderStationIdOfData(data);
            expect(data).toEqual(finalData);
        });
    });

    describe('function updateCommitteeMembers with memberId and data', () => {
        let memberId = 10;
        let url = 'api/committee-member/' + memberId + '/';
        it(`should call put with '${url}' and '${data}'`, () => {
            service.updateCommitteeMembers(memberId, data);
            expect(mockBaseService.put).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function updateDetails borderStationId and data', () => {
        let url = 'api/border-station/' + bsId + '/';
        it(`should call put with '${url}' and '${data}'`, () => {
            service.updateDetails(bsId, data);
            expect(mockBaseService.put).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function updateLocations with locationId and data', () => {
        let url = 'api/location/' + locationId + '/';
        it(`should call put with '${url}' and '${data}'`, () => {
            service.updateLocations(locationId, data);
            expect(mockBaseService.put).toHaveBeenCalledWith(url, data);
        });
    });

    describe('function updateRelationship', () => {

        let deferred = {
            resolve: () => { },
            promise: 'foo',
        };

        beforeEach(() => {
            service.$q = { defer: () => { return deferred; } };
            mockBaseService.put = () => {
                return {
                    then: (f) => {
                        f({ data: 'foo' });
                    }
                };
            };
        });

        it("should call updateDetails with 'bar' if createApiFunction is 'updateDetails'", () => {
            spyOn(service, 'updateDetails').and.callThrough();
            let obj = { id: 123 };
            service.updateRelationship([obj], 'updateDetails');
            expect(service.updateDetails).toHaveBeenCalledWith(obj.id, obj);
        });

        it("should call updateLocations with 'bar' if createApiFunction is 'updateLocations'", () => {
            spyOn(service, 'updateLocations').and.callThrough();
            let obj = { id: 123 };
            service.updateRelationship([obj], 'updateLocations');
            expect(service.updateLocations).toHaveBeenCalledWith(obj.id, obj);
        });

        let finishedCallsMessage = 'Finished sending update calls';
        it(`should call deferred.resolve with ${finishedCallsMessage} if createArray not empty`, () => {
            spyOn(deferred, 'resolve');
            service.updateRelationship([{ id: 2 }], 'updateDetails');
            expect(deferred.resolve).toHaveBeenCalledWith(finishedCallsMessage);
        });

        let noCallsMessage = 'No update calls needed';
        it(`should call deferred.resolve with ${noCallsMessage} if createArray empty`, () => {
            spyOn(deferred, 'resolve');
            service.updateRelationship([], null);
            expect(deferred.resolve).toHaveBeenCalledWith(noCallsMessage);
        });

        it("should return 'foo'", () => {
            expect(service.updateRelationship([], null)).toEqual('foo');
        });

    });

    describe('function updateStaff with staffId and data', () => {
        let url = 'api/staff/' + staffId + '/';
        it(`should call put with '${url}' and '${data}'`, () => {
            service.updateStaff(staffId, data);
            expect(mockBaseService.put).toHaveBeenCalledWith(url, data);
        });
    });

});
