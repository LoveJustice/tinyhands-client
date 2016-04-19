import AccountEditController from './accountEdit.controller';
import AccountService from './../../account.service';
import PermissionsSetsService from './../../permissionsSets.service';

describe('accountEdit Controller', () =>{
    let vm;
    let $state,
        accountService,
        permissionsSetsService;

    beforeEach(inject(($http) => {
        $state = {params: {id: 1}};
        accountService = new AccountService($http);
        permissionsSetsService = new PermissionsSetsService($http);
        vm = new AccountEditController($state, accountService, permissionsSetsService);
    }));

    describe('function constructor', () => {
        it(`emailError should be empty string`, () => {
            expect(vm.emailError).toEqual('');
        });
        it(`userDesignationError should be empty string`, () => {
            expect(vm.userDesignationError).toEqual('');
        });
        it(`sections should be object`, () => {
            let accountOptionsPath = 'app/account/components/';
            let sections = {allSections: [{ name: 'Accounts List', templateUrl: `${accountOptionsPath}list/accountList.html` },
                                           { name: 'Accounts Access Control', templateUrl: `${accountOptionsPath}control/accountControl.html` },
                                           { name: 'Accounts Defaults', templateUrl: `${accountOptionsPath}defaults/accountDefaults.html`}]};
            expect(vm.sections).toEqual(sections);
        });
    });

    describe('function update', () => {

    });

    describe('function checkFields', () => {

    });

    describe('function onUserDesignationChanged', () => {

    });

    describe('function getButtonText', () => {
        /*beforeEach(()=>{
            vm.account.permission_irf_view = false;
        });
        it(`result should be No`, () => {
            let result = vm.getButtonText(vm.account.permission_irf_view);
            expect(result).toEqual("No");
        });
        it(`result should be Yes`, () => {
            vm.account.permission_irf_view = true;
            let result = vm.getButtonText(vm.account.permission_irf_view);
            expect(result).toEqual("Yes");
        });*/
    });

    describe('function getUpdateButtonText', () => {

    });
});