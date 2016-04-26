import ActivateAccountController from './activateAccount.controller';
import AccountService from './../../account.service';

describe('activateAccount Controller', () => {
    let vm;
    let $scope,
        $state,
        accountService;

    beforeEach(inject(($rootScope, $http) => {
        $scope = $rootScope.$new();
        $state = {params: {code: null}};
        accountService = new AccountService($http);
        vm = new ActivateAccountController($scope, $state, accountService);
    }));

    describe('constructor', () => {
        beforeEach(() => {
            vm.$state.params.code = 321;
        });
        it(`activateAccount should be called`, () => {
            spyOn(accountService, 'activateAccount').and.callThrough();
            vm.constructor($scope, $state, accountService);
            expect(accountService.activateAccount).toHaveBeenCalled();
        });
    });
});