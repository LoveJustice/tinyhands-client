import IdManagementController from './idmanagement.controller';
import IdManagementService from './idmanagement.service';

describe('IdManagementController', () => {
    let vm;
    let mockStickyHeader,
        $rootScope,
        $scope,
        $timeout,
        $q,
        idManagementService,
        $uibModal,
        $state,
        $stateParams,
        document,
        mockToastr;

    let knownPersons = [

    ];

    beforeEach(inject(($http, _$rootScope_, _$q_) => {
        $q = _$q_;
        mockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);
        mockToastr = jasmine.createSpyObj('mockToastr', ['success', 'error']);
        idManagementService = jasmine.createSpyObj('mockService', ['listKnownPersons']);


        idManagementService.listKnownPersons.and.callFake(() => {
            return $q.resolve({data: knownPersons});
        });

        $stateParams = {};
        $state = {go: () => {}};
        $rootScope = _$rootScope_;
        $scope = {};

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