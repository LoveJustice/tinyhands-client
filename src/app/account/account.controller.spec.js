import AccountController from './account.controller';
import AccountService from './account.service';
import PermissionsSetsService from './permissionsSets.service';

describe('account Controller', () => {
    let vm;
    let $q,
        $scope,
        $timeout,
        $uibModal,
        $state,
        AccountService,
        PermissionsSetsService;


    beforeEach(inject(($q, $rootScope, $timeout, $http) => {
        $q = $q;
        $scope = $rootScope.$new();
        $timeout = $timeout;
        $uibModal = jasmine.createSpyObj('$uibModal', ['open']);
        $state = {params: {id: 1}};
        AccountService = new AccountService($http);
        PermissionsSetsService = new PermissionsSetsService($http);
        vm = new AccountController($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService)
    }));

    describe('function constructor', () => {
        it(`tab_1_name should be equal to 'Accounts List'`, () => {
            expect(vm.tab_1_name).toEqual('Accounts List');
        });
        /*it(`tab_2_name should be equal to 'Accounts Access Control'`, () =>{
            expect(vm.tab_2_name).toEqual('AccountsAccessControl');
        });
        it(`tab_3_name should be equal to 'Accounts Defaults'`, () =>{
            expect(vm.tab_3_name).toEqual('Accounts Defaults');
        });
        it(`sections should be object`, () => {
            let accountOptionsPath = 'app/account/components/';
            let sections = {allSections: [{ name: this.tab_1_name , templateUrl: `${accountOptionsPath}list/accountList.html` },
                                          { name: this.tab_2_name , templateUrl: `${accountOptionsPath}control/accountControl.html` },
                                          { name: this.tab_3_name , templateUrl: `${accountOptionsPath}defaults/accountDefaults.html`}]};
            expect(vm.sections).toEqual(sections);
        });
        it(`tabInfo should be an object`, () => {
            let tabInfo = {'active': null, 'sectionTemplateUrl': this.sections.allSections[0].templateUrl};
            expect(vm.tabInfo).toEqual(tabInfo);
        });
        it(`saveButtonInfo should be an object`, () => {
            let saveButtonInfo = {"saveButtonText":"Saved", "saveButtonColor":"btn-primary", "unsavedChanges": false};
            expect(vm.saveButtonInfo).toEqual(saveButtonInfo);
        });
        it(`saveText should be equal to 'Save All'`, () => {
            expect(vm.saveText).toEqual('Save All');
        });
        it(`savingText should be equal to 'Saving...'`, () => {
            expect(vm.savingText).toEqual('Saving...');
        });
        it(`savedText should be equal to 'Saved'`, () => {
            expect(vm.savedText).toEqual('Saved');
        });
        it(`saveColor should be equal to 'btn-success'`, () => {
            expect(vm.saveColor).toEqual('btn-success');
        });
        it(`savingColor should be equal to 'btn-success'`, () => {
            expect(vm.savingColor).toEqual('btn-success');
        });
        it(`savedColor should be equal to 'btn-primary'`, () => {
            expect(vm.savedColor).toEqual('btn-primary');
        });
        it(`should call AccountService.getMe`, () => {
            spyOn(vm.AccountService, 'getMe').and.callThrough();
            vm.constructor($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService);
            expect(vm.AccountService.getMe).toHaveBeenCalled();
        });
        it(`should set currentuser equal to '{id: 123}'`, () => {
            let response = {data: {id: 123}};
            vm.AccountService.getMe = () => {return {then: (f) => { f(response) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService);
            expect(vm.currentuser).toEqual('{id: 123}');
        });
        it(`should call AccountService.getAccounts`, () => {
            spyOn(vm.AccountService, 'getAccounts');
            vm.constructor($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService);
            expect(vm.AccountService.getAccounts).toHaveBeenCalled();
        });
        it(`should set accounts.local equal to '{id: 123}'`, () => {
            let result = {data: {id: 123}};
            vm.AccountService.getAccounts = () => {return {then: (f) => { f(result) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService);
            expect(vm.accounts.local).toEqual('{id: 123}');
        });
        it(`should set accounts.saved equal to accounts.local`, () => {
            let result = {data: {id: 123}};
            vm.AccountService.getAccounts = () => {return {then: (f) => { f(result) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService);
            expect(vm.accounts.saved).toEqual('{id: 123}');
        });
        it(`should call PermissionsSetsService.getPermissions`, () => {
            spyOn(vm.PermissionsSetsService, 'getPermissions');
            vm.constructor($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService);
            expect(vm.PermissionsSetsService.getPermissions).toHaveBeenCalled();
        });
        it(`should set permissions.local equal to '{foo: true}'`, () => {
            let result = {date: {foo: true}};
            vm.PermissionsSetsService.getPermissions = () => {return {then: (f) => { f(result) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService);
            expect(vm.permissions.local).toEqual('{foo: true}');
        });
        it(`should set permissions.saved equal to '{foo: true}'`, () => {
            let result = {date: {foo: true}};
            vm.PermissionsSetsService.getPermissions = () => {return {then: (f) => { f(result) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, AccountService, PermissionsSetsService);
            expect(vm.permissions.saved).toEqual('{foo: true}');
        });*/
        //test this.$scope.$on('$stateChangeStart
        //test this.$state.params.id


    });

    describe('function switchActive', () => {
        /*beforeEach(() => {
            this.saveButtonInfo.unsavedChanges = true;
            let index = 1;
        });
        it(`openUnsavedChangesModal should be called`, () => {
            spyOn(vm, 'openUnsavedChangesModal');
            vm.switchActive(index);
            expect(vm.openUnsavedChangesModal).toHaveBeenCalled();
        });
        it(`activateTab should be called`, () => {
            this.saveButtonInfo.unsavedChanges = false;
            spyOn(vm, 'activateTab');
            vm.switchActive(index);
            expect(vm.activateTab).toHaveBeenCalled();
        });*/
    });

    describe('function activateTab', () => {
        /*beforeEach(() => {
            let index = 1;
        });
        it(`tabInfo.active should be 1`, () => {
            activateTab(index);
            expect(vm.tabInfo.active).toEqual(1);
        });
        it(`tabInfo.sectionTemplateUrl should be equal to sections.allSections[1].templateUrl`, () => {
            let section = vm.sections.allSections[1].templateUrl;
            activateTab(index);
            expect(vm.tabInfo.sectionTemplateUrl).toEqual(section);
        });
        it(`$state.transitionTo should be called`, () => {
            spyOn(vm.$state, 'transitionTo');
            vm.activateTab(index);
            expect(vm.$state.transitionTo).toHaveBeenCalled();
        });*/
    });

    describe('function editUser', () => {
        /*beforeEach(() => {
            id = 123;
        });
        it(`tabInfo.active should be -1`, () => {
            vm.editUser(id);
            expect(vm.tabInfo.active).toEqual(-1);
        });
        it(`tabInfo.sectionTemplateUrl should be equal to editAccountPath`, () => {
            let section = vm.editAccountPath;
            editUser(id);
            expect(vm.tabInfo.sectionTemplateUrl).toEqual(section);
        });
        it(`$state.transitionTo should be called`, () => {
            spyOn(vm.$state, 'transitionTo');
            vm.editUser(id);
            expect(vm.$state.transitionTo).toHaveBeenCalled();
        });*/
    });

    describe('saveAll', () => {
        /*beforeEach(() => {
            let arrays = {local: {id: 123},
                      saved: {id: 123}};
            let serviceToUse = vm.AccountService;
        });
        it(`updateSaveButton should be called`, () => {
            spyOn(vm, 'updateSaveButton');
            vm.saveAll(arrays, serviceToUse);
            expect(vm.updateSaveButton).toHaveBeenCalled();
        });*/
        //test rest of saveAll
    });

    describe('function saveSet', () => {
        //test saveSet
    });

    describe('checkIfModified', () => {
        /*beforeEach(() => {
            let arrays = {local: {[{is_new: false, is_modified: false, id: 123}]},
                          saved: {[{is_new: false, is_modified: false, id: 123}]}};
            let index = 0;
        });
        it(`arrays.local[0].is_modified should be true`, () => {
            arrays.local[0].is_new = true;
            vm.checkIfModified(index, arrays);
            expect(arrays.local[index].is_modified).toEqual(true);
        });
        it(`arrays.local[0].is_modified should be true`, () => {
            arrays.local[0].id = 011;
            vm.checkIfModified(index, arrays);
            expect(arrays.local[index].is_modified).toEqual(true);
        });
        it(`arrays.local[0].is_modified should be false`, () => {
            vm.checkIfModified(index, arrays);
            expect(arrays.local[index].is_modified).toEqual(false);
        });
        it(`checkForUnsavedChanges should be called`, () => {
            spyOn(vm, 'checkForUnsavedChanges');
            vm.checkIfModified(index, arrays);
            expect(vm.checkForUnsavedChanges).toHaveBeenCalled();
        });*/
    });

    describe('function checkForUnsavedChanges', () => {
        /*beforeEach(() => {
           let arrays = {local: {[{is_new: false, is_modified: false, id: 123}]},
                         saved: {[{is_new: false, is_modified: false, id: 123}]}};
        });
        it(`unsavedChanges should be false`, () => {
            vm.checkForUnsavedChanges(arrays);
            expect(vm.saveButtonInfo.unsavedChanges).toEqual(false);
        });
        it(`unsavedChanges should be true`, () => {
            arrays.local.push({is_new: true, is_modified: false, id: 123});
            vm.checkForUnsavedChanges(arrays);
            expect(vm.saveButtonInfo.unsavedChanges).toEqual(true);
        });
        it(`unsavedChanges should be true`, () => {
            arrays.local[0].is_modified = true;
            vm.checkForUnsavedChanges(arrays);
            expect(vm.saveButtonInfo.unsavedChanges).toEqual(true);
        });*/
    });

    describe('updateSaveButton', () => {
        /*beforeEach(() => {
            let text = "Saved";
            let color = "btn-success";
            let unsavedChanges = true;
        });
        it(`saveButtonText should be equal to text`, () => {
            vm.updateSaveButton(text, color, unsavedChanges);
            expect(vm.saveButtonInfo.saveButtonText).toEqual(text);
        });
        it(`saveButtonColor should be equal to color`, () => {
            vm.updateSaveButton(text, color, unsavedChanges);
            expect(vm.saveButtonInfo.saveButtonColor).toEqual(color);
        });
        it(`unsavedChanges should be true`, () => {
            vm.updateSaveButton(text, color, unsavedChanges);
            expect(vm.saveButtonInfo.unsavedChanges).toEqual(true);
        });
        it(`unsavedChanges should be false`, () => {
            unsavedChanges = false;
            vm.updateSaveButton(text, color, unsavedChanges);
            expect(vm.saveButtonInfo.unsavedChanges).toEqual(false);
        });*/

    });

    describe('discardChanges', () => {
        /*beforeEach(() => {
            let arrays = {local: [{is_new: false, is_modified: true, id: 321}],
                          saved: [{is_new: false, is_modified: false, id: 123}]};
        });
        it(`local array should be the same as saved array`, () => {
            vm.discardChanges(arrays);
            expect(arrays.local).toEqual(arrays.saved);
        });*/
    });

    describe('openUnsavedChangesModal', () => {

    });

    describe('function resendActivationEmail', () => {
        /*spyOn(vm.AccountService, 'resendActivationEmail');
        vm.resendActivationEmail(123);
        expect(vm.AccountService.resendActivationEmail).toHaveBeenCalled);*/
    });

    describe('function deleteAccount', () => {
        /*beforeEach(() => {
         let account = {id: 123, accountdelete: true};
         });
         it(`destroy should be called`, () => {
         spyOn(vm.AccountService, 'destroy');
         vm.deleteAccount(account);
         expect(vm.AccountService.destroy).toHaveBeenCalled();
         });
         it(`getAccounts should be called`, () => {
         spyOn(vm.AccountService, 'getAccounts');
         vm.deleteAccount(account);
         expect(vm.AccountService.getAccounts).toHaveBeenCalled();
         });
         it(`accounts should be equal to the response`, () => {
         let response = {data: {id: 321}};
         vm.AccountService.getAccounts = () => {return {then: (f) => { f(response) }}};
         vm.deleteAccount(account);
         expect(vm.accounts).toEqual('{id: 321}');
         });
         it(`accountdelete should be true`, () => {
         account.accountdelete = false;
         vm.deleteAccount(account);
         expect(account.accountdelete).toEqual(true);
         });*/
    });

    describe('function changeUserRole', () => {
        /*beforeEach(() => {
            let accounts = {local: [{permission_irf_view: true;}]};
            let index = 0;
        });
        it(`getPermission should be called`, () => {
            spyOn(vm.PermissionsSetsService, 'getPermission');
            vm.changeUserRole(index);
            expect(vm.PermissionsSetsService.getPermission).toHaveBeenCalled();
        });
        it(`accounts should be equal to result`, () => {
            let result = {permission_irf_view: false};
            vm.PermissionsSetsService.getPermission = () => {return {then: (f) => { f(result) }}};
            vm.changeUserRole(index);
            expect(accounts.local[index].permission_irf_view).toEqual(false);
        });*/
    });

    describe('function addAnother', () => {
        /*beforeEach(() => {
            vm.permissions = {local: [{id: 123}]};
        });
        it(`permissions.local[1] is_new should be true`, () => {
            vm.addAnother();
            expect(vm.permissions.local[1].is_new).toEqual(true);
        });
        it(`checkForUnsavedChanges should be called`, () => {
            spyOn(vm, 'checkForUnsavedChanges');
            vm.addAnother();
            expect(vm.checkForUnsavedChanges).toHaveBeenCalled();
        });*/
    });

    describe('function deletePermissionRole', () => {
        /*beforeEach(() => {
            vm.permissions = {local: [{is_used_by_accounts: false, accountRemoved: true, is_new: true;}]}

        });*/
    });

    describe('function update', () => {

    });

    describe('function checkFields', () => {

    });

    describe('function onUserDesignationChanged', () => {

    });

    describe('function getButtonText', () => {

    });

    describe('function getUpdateButtonText', () => {

    });
});