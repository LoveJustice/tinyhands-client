import AccessControlController from './accessControl.controller';

describe('AccessControlController', () => {

    let controller,
        rootScope,
        scope,
        mockEvent,
        stateName,
        $q,
        mockUibModal,
        mockState,
        mockStateParams,
        response,
        mockPermissionsService,
        mockUserPermissionsService,
        mockAccountService,
        mockStickyHeader,
        mockToastr,
        getCountriesResponse,
        getBorderStationsResponse,
        getUserPermissionsResponse,
        userPermissionsGetPermissionsResponse,
        getUserPermissionsGlobalResponse,
        getUserPermissionsCountryResponse;

    beforeEach(angular.mock.module('tinyhands.Account'));

    beforeEach(inject((_$q_, $rootScope) => {
        rootScope = $rootScope; 
        scope = jasmine.createSpyObj('mockScope', ['$on']);
        mockEvent = jasmine.createSpyObj('mockEvent', ['preventDefault']);
        stateName = 'FooState';
        scope.$on.and.callFake((eventName, callback) => {
            callback(mockEvent, { name: stateName });
        });
        $q = _$q_;
        mockUibModal = jasmine.createSpyObj('mockUibModal', ['open']);
        mockUibModal.open.and.callFake(() => {
            return { result: $q.resolve(false) };
        });

        mockState = jasmine.createSpyObj('mockState', ['go']);
        mockStateParams = {"acState": null};


        mockPermissionsService = jasmine.createSpyObj('PermissionsService', ['getPermissions', 'getPermission', 'create', 'update', 'destroy']);

        mockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);

        response = { data: { results: [{ id: 1, name: 'Foo' }] } };
        mockPermissionsService.getPermissions.and.callFake(() => {
            return $q.resolve(response);
        });

        mockToastr = jasmine.createSpyObj('mockToastr', ['error']);
        mockUserPermissionsService = jasmine.createSpyObj('UserPermissionsService',['getPermissions', 'getUserPermissions', 'getAllCountries', 'getBorderStations', 'getUserPermissionsList']);
        
        userPermissionsGetPermissionsResponse = { data:{ results: [{id:1, permission_group:'IRF', action:'VIEW', min_level:'STATION'}, {id:2, permission_group:'VIF', action:'ADD', min_level: 'STATION'}]}};
        mockUserPermissionsService.getPermissions.and.callFake(() => {
            return $q.resolve(userPermissionsGetPermissionsResponse);
        });
        
        getUserPermissionsResponse = { data: [{account:10022, country:null, station:null, permission:1}, {account:10022, country:1, station:null, permission:2}]};
        mockUserPermissionsService.getUserPermissions.and.callFake((id) => {
                return $q.resolve(getUserPermissionsResponse);
        });
        
        getUserPermissionsGlobalResponse = {data:[{account_id: 10022, name: 'Sup Test', permissions:[{id:1, level:'G'}]}]};
        getUserPermissionsCountryResponse = {data:[{account_id: 10022, name: 'Sup Test', permissions:[{id:1, level:'G'}, {id:2, level:'C'}]}]};
        mockUserPermissionsService.getUserPermissionsList.and.callFake((countryId, stationId) => {
            if (countryId!==null) {
                return $q.resolve(getUserPermissionsCountryResponse);
            } else {
                return $q.resolve(getUserPermissionsGlobalResponse);
            }
    });
        
        getCountriesResponse = { data: {results: [{id:1, name:'Nepal'}, {id:2, name:'South Africa'}]}};
        mockUserPermissionsService.getAllCountries.and.callFake(() => {
                return $q.resolve(getCountriesResponse);
        });

        getBorderStationsResponse = { data: [{id:1, station_name:'Station1', operating_country:1}, {id:2, station_name:'Station2', operating_country:2}]};
        mockUserPermissionsService.getBorderStations.and.callFake(() => {
                return $q.resolve(getBorderStationsResponse);
        });

        controller = new AccessControlController(mockUserPermissionsService, mockStickyHeader, $q, mockState, mockStateParams, mockUibModal, scope, mockToastr);
    }));
    

    describe('getCountries', () => {
        it('should get countries from UserLocationPermissionsService', () => {
            controller.getCountries();

            expect(mockUserPermissionsService.getAllCountries).toHaveBeenCalled();
        });

        it('should set countries with response from UserLocationPermissionsService', () => {
            controller.getCountries();
            rootScope.$apply();

            expect(controller.acState.countries).toEqual(getCountriesResponse.data.results);
            
            var countryOptions = [{id: -1, label: "Global"}, {id: -2, label:"", disabled : true}, {id: 1, label: "Nepal"}, {id: 2, label: "South Africa"}];

            expect(controller.countryOptions).toEqual(countryOptions);
        });
        
    });
    
    describe('getStations', () => {
        it('should get stations from UserLocationPermissionsService', () => {
            controller.getStations();

            expect(mockUserPermissionsService.getBorderStations).toHaveBeenCalled();
        });

        it('should set stations with response from UserLocationPermissionsService', () => {
            controller.getStations();
            rootScope.$apply();

            expect(controller.acState.stations).toEqual(getBorderStationsResponse.data);
        });
    });
    
    describe('getPermissions', () => {
        it('should get permissions from UserLocationPermissionsService', () => {
            controller.getPermissions();

            expect(mockUserPermissionsService.getPermissions).toHaveBeenCalled();  
        });

        it('should set permissions in acState with response from UserLocationPermissionsService', () => {
            controller.getPermissions();
            rootScope.$apply();

            expect(controller.acState.permissions).toEqual(userPermissionsGetPermissionsResponse.data.results);
        });
        
        it('should set accounts with global permissions from UserLocationPermissionsService', () => {
            controller.getPermissions();
            rootScope.$apply();

            var globalAccts = [{ id: 10022, name: 'Sup Test', permissions: {0:'G', 1:'X' }}];
            expect(controller.accounts).toEqual(globalAccts);
        });
        
        it('should set accounts with global permissions from UserLocationPermissionsService', () => {
            controller.getPermissions();
            rootScope.$apply();
            controller.getAccounts(1,null);
            rootScope.$apply();

            var globalAccts = [{ id: 10022, name: 'Sup Test', permissions: {0:'G', 1:'C' }}];
            expect(controller.accounts).toEqual(globalAccts);
        });
    });
});