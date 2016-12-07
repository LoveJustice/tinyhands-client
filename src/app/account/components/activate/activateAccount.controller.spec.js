import ActivateAccountController from './activateAccount.controller';
import AccountService from './../../account.service';

describe('activateAccount Controller', () => {
    let vm;
    let $scope,
        $state,
        accountService,
        session;

    beforeEach(inject(($rootScope, $http) => {
        $scope = $rootScope.$new();
        $state = { params: { activation_key: null } };
        accountService = new AccountService($http);
        session = jasmine.createSpyObj('session', ['attemptLogin']);
        vm = new ActivateAccountController($scope, $state, accountService, session);
    }));

    describe('function constructor', () => {
        beforeEach(() => {
            vm.$state.params.activation_key = 321;
        });
        it(`activateAccount should be called`, () => {
            spyOn(accountService, 'activateAccount').and.callThrough();
            vm.constructor($scope, $state, accountService, session);
            expect(accountService.activateAccount).toHaveBeenCalled();
        });
        it(`invalidAccount should be true`, () => {
            let response = { data: "account_already_active/invalid_key" };
            accountService.activateAccount = () => { return { then: (f) => { f(response) } } };
            vm.constructor($scope, $state, accountService, session);
            expect(vm.invalidAccount).toEqual(true);
        });
        it(`account should be equal to data`, () => {
            let response = { data: { id: 123 } };
            accountService.activateAccount = () => { return { then: (f) => { f(response) } } };
            vm.constructor($scope, $state, accountService, session);
            expect(vm.account).toEqual(response.data);
        });
    });
    describe('function update', () => {
        beforeEach(() => {
            vm.account = { id: 123 };
            vm.$state.params.activation_key = 321;
        });
        it(`nonMatchingPasswords should be true`, () => {
            let response = { data: "unmatching_passwords" };
            accountService.activateAccountPassword = () => { return { then: (f) => { f(response) } } };
            vm.update();
            expect(vm.nonMatchingPasswords).toEqual(true);
        });
        it(`invalidAccount should be true`, () => {
            let response = { data: "account_already_active/invalid_key" };
            accountService.activateAccountPassword = () => { return { then: (f) => { f(response) } } };
            vm.update();
            expect(vm.invalidAccount).toEqual(true);
        });
        it(`session.attemptLogin should be called`, () => {
            let response = { data: "account_saved" };
            accountService.activateAccountPassword = () => { return { then: (f) => { f(response) } } };
            vm.update();
            expect(vm.session.attemptLogin).toHaveBeenCalled();
        });
    });
});
