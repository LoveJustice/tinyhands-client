import IdManagementController from './idmanagement.controller';
import IdManagementService from './idmanagement.service';

describe('IdManagementController', () => {
    let vm;
    let mockStickyHeader,
        $rootScope,
        $scope,
        $timeout,
        idManagementService,
        $uibModal,
        $state,
        $stateParams,
        document,
        mockToastr;

    beforeEach(inject(($http) => {
        mockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);
        mockToastr = jasmine.createSpyObj('mockToastr', ['success', 'error']);
        idManagementService = new IdManagementService($http);
        $stateParams = {};
        $state = {go: () => {}};

        vm = new IdManagementController(mockStickyHeader, $rootScope, $scope, $http, $timeout, idManagementService, $uibModal, $state, $stateParams, document, mockToastr);
    }));
    
    describe('function constructor', () => {
        it('reverse should be false', () => {
            expect(vm.reverse).toBe(false);
        });

        it('paginateBy should be 25 by default', () => {
            expect(vm.paginateBy).toEqual(25);
        });

        it('addresses should be an empty array', () => {
            expect(vm.knownPersons).toEqual([]);
        });

        it('searchValue should be an empty string', () => {
            expect(vm.searchValue).toEqual("");
        });

        it('nextPageUrl should be an empty string', () => {
            expect(vm.nextPageUrl).toEqual("");
        });

        it('sortColumn should be an empty string', () => {
            expect(vm.sortColumn).toEqual("");
        });
        
        it('addSearchValue should be an empty string', () => {
            expect(vm.addSearchValue).toEqual("");
        });
        
        it('showIdMgmt should be true', () => {
            expect(vm.showIdMgmt).toBe(true);
        });
        
        it('showAddAlias should be false', () => {
            expect(vm.showAddAlias).toBe(false);
        });
        
        it('showRemoveAlias should be false', () => {
            expect(vm.showRemoveAlias).toBe(false);
        });
    });
});