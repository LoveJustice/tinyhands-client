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
        accountService,
        permissionsSetsService;


    beforeEach(inject((_$q_, $rootScope, _$timeout_, $http, $httpBackend) => {
        $q = _$q_;
        $scope = $rootScope.$new();
        $timeout = _$timeout_;
        $uibModal = jasmine.createSpyObj('$uibModal', ['open']);
        $state = {params: {id: 1}, transitionTo: () => {}, go: () => {}};
        accountService = new AccountService($http);
        permissionsSetsService = new PermissionsSetsService($http);
        $httpBackend.whenGET('http://edwards.cse.taylor.edu:80//api/me/').respond({data: 'foo'});
        $httpBackend.whenGET('http://edwards.cse.taylor.edu:80//api/account/all/').respond({data: 'foo'});
        $httpBackend.whenGET('http://edwards.cse.taylor.edu:80//api/defaultPermissionsSet/').respond({data: 'foo'});
        $httpBackend.whenGET('http://edwards.cse.taylor.edu:80//api/account/1/').respond({data: 'foo'});
        $httpBackend.whenPUT('http://edwards.cse.taylor.edu:80//api/account/123/').respond({data: 'foo'});
        $httpBackend.whenPOST('http://edwards.cse.taylor.edu:80//api/account/').respond({date: 'foo'});
        vm = new AccountController($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
    }));

    describe('function constructor', () => {
        it(`tab_1_name should be equal to 'Accounts List'`, () => {
            expect(vm.tab_1_name).toEqual('Accounts List');
        });
        it(`tab_2_name should be equal to 'Accounts Access Control'`, () =>{
            expect(vm.tab_2_name).toEqual('Accounts Access Control');
        });
        it(`tab_3_name should be equal to 'Accounts Defaults'`, () =>{
            expect(vm.tab_3_name).toEqual('Accounts Defaults');
        });
        it(`sections should be object`, () => {
            let accountOptionsPath = 'app/account/components/';
            let sections = {allSections: [{ name: vm.tab_1_name , templateUrl: `${accountOptionsPath}list/accountList.html` },
                                          { name: vm.tab_2_name , templateUrl: `${accountOptionsPath}control/accountControl.html` },
                                          { name: vm.tab_3_name , templateUrl: `${accountOptionsPath}defaults/accountDefaults.html`}]};
            expect(vm.sections).toEqual(sections);
        });
        it(`tabInfo should be an object`, () => {
            let tabInfo = {'active': null, 'sectionTemplateUrl': null};
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
        it(`should call accountService.getMe`, () => {
            spyOn(accountService, 'getMe').and.callThrough();
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect(accountService.getMe).toHaveBeenCalled();
        });
        it(`should set currentuser equal to '{id: 123}'`, () => {
            let response = {data: {id: 123}};
            accountService.getMe = () => {return {then: (f) => { f(response) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            //$scope.$apply();
            expect(vm.currentuser).toEqual(response.data);
        });
        it(`should call accountService.getAccounts`, () => {
            spyOn(accountService, 'getAccounts').and.callThrough();
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect(accountService.getAccounts).toHaveBeenCalled();
        });
        it(`should set accounts.local equal to '{id: 123}'`, () => {
            let result = {data: {id: 123}};
            accountService.getAccounts = () => {return {then: (f) => { f(result) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            //$scope.$apply();
            expect(vm.accounts.local).toEqual(result.data);
        });
        it(`should set accounts.saved equal to accounts.local`, () => {
            let result = {data: {id: 123}};
            accountService.getAccounts = () => {return {then: (f) => { f(result) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect(vm.accounts.saved).toEqual(result.data);
        });
        it(`should call permissionsSetsService.getPermissions`, () => {
            spyOn(permissionsSetsService, 'getPermissions').and.callThrough();
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect(permissionsSetsService.getPermissions).toHaveBeenCalled();
        });
        it(`should set permissions.local equal to '{foo: true}'`, () => {
            let result = {data: {results: {foo: true}}};
            permissionsSetsService.getPermissions = () => {return {then: (f) => { f(result) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect(vm.permissions.local).toEqual(result.data.results);
        });
        it(`should set permissions.saved equal to '{foo: true}'`, () => {
            let result = {data: {results: {foo: true}}};
            permissionsSetsService.getPermissions = () => {return {then: (f) => { f(result) }}};
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect(vm.permissions.saved).toEqual(result.data.results);
        });
        it(`accountCreate should be called`, () => {
            vm.$state.params.id = 'create';
            spyOn(vm, 'accountCreate');
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect(vm.accountCreate).toHaveBeenCalled();
        });
        it(`retrieveAccount should be called`, () => {
            vm.$state.params.id = 1;
            spyOn(vm, 'retrieveAccount');
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect(vm.retrieveAccount).toHaveBeenCalled();
        });
        it(`activeTab should be equal to 0`, () => {
            vm.$state.params.id = false;
            vm.$state.params.activeTab = undefined;
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect($state.params.activeTab).toEqual(0);
        });
        it(`switchActive should be called`, () => {
            vm.$state.params.id = false;
            vm.$state.params.activeTab = 1;
            spyOn(vm, 'switchActive');
            vm.constructor($q, $scope, $timeout, $uibModal, $state, accountService, permissionsSetsService);
            expect(vm.switchActive).toHaveBeenCalled();
        });
    });

    describe('function switchActive', () => {
        let index = 1;
        it(`openUnsavedChangesModal should be called`, () => {
            vm.saveButtonInfo.unsavedChanges = true;
            spyOn(vm, 'openUnsavedChangesModal');
            vm.switchActive(index);
            expect(vm.openUnsavedChangesModal).toHaveBeenCalled();
        });
        it(`activateTab should be called`, () => {
            vm.saveButtonInfo.unsavedChanges = false;
            spyOn(vm, 'activateTab');
            vm.switchActive(index);
            expect(vm.activateTab).toHaveBeenCalled();
        });
    });

    describe('function activateTab', () => {
        let index = 1;
        it(`tabInfo.active should be 1`, () => {
            vm.activateTab(index);
            expect(vm.tabInfo.active).toEqual(1);
        });
        it(`tabInfo.sectionTemplateUrl should be equal to sections.allSections[1].templateUrl`, () => {
            let section = vm.sections.allSections[1].templateUrl;
            vm.activateTab(index);
            expect(vm.tabInfo.sectionTemplateUrl).toEqual(section);
        });
        it(`$state.transitionTo should be called`, () => {
            spyOn(vm.$state, 'transitionTo');
            vm.activateTab(index);
            expect(vm.$state.transitionTo).toHaveBeenCalled();
        });
    });

    describe('function retrieveAccount', () => {
        let id = 1;
        it(`getAccount should be called`, () => {
            spyOn(accountService, 'getAccount').and.callThrough();
            vm.retrieveAccount(id);
            expect(accountService.getAccount).toHaveBeenCalled();
        });

        it(`accountEdit should be called`, () => {
            let result = {data: {id: 1}};
            accountService.getAccount = () => {return {then: (f) => { f(result) }}};
            spyOn(vm, 'accountEdit');
            vm.retrieveAccount(id);
            expect(vm.accountEdit).toHaveBeenCalled();
        });
        /*it(`accountNotFound should be called`, () => {
            accountService.getAccount = () => {return {then: (f) => { f(error) }}};
            id = 123;
            spyOn(vm, 'accountNotFound');
            vm.retrieveAccount(id);
            expect(vm.accountNotFound).toHaveBeenCalled();
        });*/
    });

    describe('function accountEdit', () => {
        let account = {first_name: 'James', last_name: 'Rodger', id: 123};
        it(`tabInfo.active should be -1`, () => {
            vm.accountEdit(account);
            expect(vm.tabInfo.active).toEqual(-1);
        });
        it(`tabInfo.sectionTemplateUrl should be equal to editAccountPath`, () => {
            let section = vm.editAccountPath;
            vm.accountEdit(account);
            expect(vm.tabInfo.sectionTemplateUrl).toEqual(section);
        });
        it(`vm.account should be equal to account`, () => {
            vm.accountEdit(account);
            expect(vm.account).toEqual(account);
        });
        it(`editing should be equal to true`, () => {
            vm.accountEdit(account);
            expect(vm.editing).toEqual(true);
        });

        it(`$state.transitionTo should be called`, () => {
            spyOn(vm.$state, 'transitionTo');
            vm.accountEdit(account);
            expect(vm.$state.transitionTo).toHaveBeenCalled();
        });
    });

    describe('function accountCreate', () => {
        it(`tabInfo.active should be equal to -1`, () => {
            vm.tabInfo.active = 0;
            vm.accountCreate();
            expect(vm.tabInfo.active).toEqual(-1);
        });
        it(`tabeInfo.sectionTemplateUrl should be equal to editAccountPath`, () => {
            vm.accountCreate();
            expect(vm.tabInfo.sectionTemplateUrl).toEqual(vm.editAccountPath);
        });
        it(`$state.transitionTo should be called`, () => {
            spyOn(vm.$state, 'transitionTo');
            vm.accountCreate();
            expect(vm.$state.transitionTo).toHaveBeenCalled();
        });
    });

    describe('function accountNotFound', () => {
        let id = 123;
        it(`vm.idNotFound should be equal to id`, () => {
            vm.accountNotFound(id);
            expect(vm.idNotFound).toEqual(id);
        });
        it(`tabInfo.active should be equal to -1`, () => {
            vm.accountNotFound(id);
            expect(vm.tabInfo.active).toEqual(-1);
        });
        it(`tabInfo.sectionTemplateUrl should be equal to accountNotFoundPath`, () => {
            vm.accountNotFound(id);
            expect(vm.tabInfo.sectionTemplateUrl).toEqual(vm.accountNotFoundPath);
        });
    });

    describe('function saveAll', () => {
        beforeEach(() =>    {
            vm.accounts = {local: [{id: 123, is_modified: true, permission_accounts_manage: true}], saved: [{id: 123, permission_accounts_manage: false}]};
        });
        it(`updateSaveButton should be called`, () => {
            spyOn(vm, 'updateSaveButton');
            vm.saveAll(vm.accounts, accountService);
            expect(vm.updateSaveButton).toHaveBeenCalled();
        });
        it(`saveSet should be called`, () => {
            spyOn(vm, 'saveSet');
            vm.saveAll(vm.accounts, accountService);
            expect(vm.saveSet).toHaveBeenCalled();
        });
        it(`arrays.saved should be equal to arrays.local`, () => {
            vm.saveAll(vm.accounts, accountService);
            $scope.$apply();
            $timeout.flush();
            expect(vm.accounts.local).toEqual(vm.accounts.saved);
        });
    });

    describe('function saveSet', () => {
        let index = 0;
        let local = [{id: 123, is_modified: false, is_new: false}];
        beforeEach(() => {
            local = [{id: 123, is_modified: false, is_new: false}];
        });
        it(`create should be called`, () => {
            local[0].is_new = true;
            spyOn(accountService, 'create').and.callThrough();
            vm.saveSet(index, local, accountService);
            $scope.$apply();
            expect(accountService.create).toHaveBeenCalled();
        });
        it(`update should be called`, () => {
            local[0].is_modified = true;
            spyOn(accountService, 'update').and.callThrough();
            vm.saveSet(index, local, accountService);
            $scope.$apply();
            expect(accountService.update).toHaveBeenCalled();
        });

    });

    describe('function checkIfModified', () => {
        let arrays = {local: [{is_new: false, is_modified: false, id: 123}], saved: [{is_new: false, is_modified: false, id: 123}]};
        let index = 0;
        it(`arrays.local[0].is_modified should be false`, () => {
            vm.checkIfModified(index, arrays);
            expect(arrays.local[index].is_modified).toEqual(false);
        });
        it(`checkForUnsavedChanges should be called`, () => {
            spyOn(vm, 'checkForUnsavedChanges');
            vm.checkIfModified(index, arrays);
            expect(vm.checkForUnsavedChanges).toHaveBeenCalled();
        });
        it(`arrays.local[0].is_modified should be true`, () => {
            arrays.local[0].id = 321;
            vm.checkIfModified(index, arrays);
            expect(arrays.local[index].is_modified).toEqual(true);
        });
        it(`arrays.local[0].is_modified should be true`, () => {
            arrays.local[0].is_new = true;
            vm.checkIfModified(index, arrays);
            expect(arrays.local[index].is_modified).toEqual(true);
        });
    });

    describe('function checkForUnsavedChanges', () => {
        let arrays = {local: [{is_new: false, is_modified: false, id: 123}], saved: [{is_new: false, is_modified: false, id: 123}]};
        it(`updateSaveButton should be called`, () => {
            spyOn(vm, 'updateSaveButton');
            vm.checkForUnsavedChanges(arrays);
            expect(vm.updateSaveButton).toHaveBeenCalled();
        });
    });

    describe('function updateSaveButton', () => {
        it(`saveButtonText should be equal to text`, () => {
            vm.updateSaveButton(vm.saveText, vm.saveColor, true, 100);
            $timeout.flush();
            expect(vm.saveButtonInfo.saveButtonText).toEqual(vm.saveText);
        });
        it(`saveButtonColor should be equal to color`, () => {
            vm.updateSaveButton(vm.saveText, vm.saveColor, true, 100);
            $timeout.flush();
            expect(vm.saveButtonInfo.saveButtonColor).toEqual(vm.saveColor);
        });
        it(`unsavedChanges should be true`, () => {
            vm.updateSaveButton(vm.saveText, vm.saveColor, true, 100);
            $timeout.flush();
            expect(vm.saveButtonInfo.unsavedChanges).toEqual(true);
        });
        it(`unsavedChanges should be false`, () => {
            vm.updateSaveButton(vm.savedText, vm.savedColor, false, 100);
            $timeout.flush();
            expect(vm.saveButtonInfo.unsavedChanges).toEqual(false);
        });

    });

    describe('function discardChanges', () => {
        let arrays = {local: [{is_new: false, is_modified: true, id: 321}], saved: [{is_new: false, is_modified: false, id: 123}]};
        it(`local array should be the same as saved array`, () => {
            vm.discardChanges(arrays);
            expect(arrays.local).toEqual(arrays.saved);
        });
        it(`updateSaveButton should be called`, () => {
            spyOn(vm, 'updateSaveButton');
            vm.discardChanges(arrays);
            expect(vm.updateSaveButton).toHaveBeenCalled()
        });
    });

    describe('function openUnsavedChangesModal', () => {
        let index = 0;
        let toState = null;
        beforeEach(() => {
            vm.sections = {allSections: [{name: vm.tab_2_name, templateUrl: 'app/account/components/control/accountControl.html'}]};
            vm.tabInfo = {active: 0}
        });
        it(`$uibModal.open should be called`, () => {
            $uibModal.open.and.callFake(() => {
                return {result: $q.when('save')};
            });
            vm.openUnsavedChangesModal(index, toState);
            expect($uibModal.open).toHaveBeenCalled();
        });
        it(`saveAll should be called`, () => {
            $uibModal.open.and.callFake(() => {
                return {result: $q.when('save')};
            });
            spyOn(vm, 'saveAll').and.returnValue($q.resolve());;
            vm.openUnsavedChangesModal(index, toState);
            $scope.$apply();
            expect(vm.saveAll).toHaveBeenCalled();
        });
        it(`discardChanges should be called`, () => {
            $uibModal.open.and.callFake(() => {
                return {result: $q.when('discard')};
            });
            spyOn(vm, 'discardChanges');
            vm.openUnsavedChangesModal(index, toState);
            $scope.$apply();
            expect(vm.discardChanges).toHaveBeenCalled();
        });
        // test openUnsavedChangesModal
    });

    describe('function resendActivationEmail', () => {
        let id = 123;
        it(`resendActivationEmail should be called`, () =>  {
            spyOn(accountService, 'resendActivationEmail').and.callThrough();
            vm.resendActivationEmail(id);
            expect(accountService.resendActivationEmail).toHaveBeenCalled();
        });
    });

    describe('function deleteAccount', () => {
        beforeEach(() => {
            vm.currentuser = {id: 1};
            accountService.destroy = () => {return {then: (f) => { f(true) }}};
        });
        let account = {id: 123, accountdelete: true};
        it(`destroy should be called`, () => {
         spyOn(accountService, 'destroy').and.callThrough();
         vm.deleteAccount(account);
         expect(accountService.destroy).toHaveBeenCalled();
        });
        it(`getAccounts should be called`, () => {
         spyOn(accountService, 'getAccounts').and.callThrough();
         vm.deleteAccount(account);
         expect(accountService.getAccounts).toHaveBeenCalled();
        });
        it(`accounts should be equal to the response`, () => {
         let response = {data: {id: 321}};
         accountService.getAccounts = () => {return {then: (f) => { f(response) }}};
         vm.deleteAccount(account);
         expect(vm.accounts.local).toEqual(response.data);
        });
        it(`accountdelete should be true`, () => {
         account.accountdelete = false;
         vm.deleteAccount(account);
         expect(account.accountdelete).toEqual(true);
        });
    });

    describe('function changeUserRole', () => {
        let index = 0;
        beforeEach(() => {
            vm.accounts = {local: [{user_designation: 1}], saved: [{user_designation: 1}]};
        });
        it(`should call getPermission`, () => {
            spyOn(permissionsSetsService, 'getPermission').and.callThrough();
            vm.changeUserRole(index);
            expect(permissionsSetsService.getPermission).toHaveBeenCalled();
        });
        it(`should call checkIfModified`, () => {
            spyOn(vm, 'checkIfModified');
            vm.changeUserRole(index);
            expect(vm.checkIfModified).toHaveBeenCalled();
        });
    });

    describe('function addAnother', () => {
        beforeEach(() => {
            vm.permissions = {local: [{id: 123}], saved: [{id: 213}]};
        });
        it(`permissions.local[1] is_new should be true`, () => {
            vm.addAnother();
            expect(vm.permissions.local[1].is_new).toEqual(true);
        });
        it(`checkForUnsavedChanges should be called`, () => {
            spyOn(vm, 'checkForUnsavedChanges');
            vm.addAnother();
            expect(vm.checkForUnsavedChanges).toHaveBeenCalled();
        });
    });

    describe('function deletePermissionRole', () => {
        let index = 0;
        beforeEach(() => {
            vm.permissions = {local: [{is_used_by_accounts: false, accountRemoved: true, is_new: true}], saved: []};
        });
        it(`checkForUnsavedChanges should be called`, () => {
            spyOn(vm, 'checkForUnsavedChanges');
            vm.deletePermissionRole(index);
            expect(vm.checkForUnsavedChanges).toHaveBeenCalled();
        });
        it(`destroy should be called`, () => {
            vm.permissions.local[0].is_new = false;
            spyOn(permissionsSetsService, 'destroy').and.callThrough();
            vm.deletePermissionRole(index);
            expect(permissionsSetsService.destroy).toHaveBeenCalled()
        });
        it(`accountRemoved should be true`, () => {
            vm.permissions.local[0].accountRemoved = false;
            vm.deletePermissionRole(index);
            expect(vm.permissions.local[index].accountRemoved).toEqual(true);
        });
    });

    describe('function update', () => {
        beforeEach(() => {
            vm.account = {email: 'troll@taylor.edu', user_designation: 1};
            vm.editing = true;
        });
        it(`update should be called`, () => {
            spyOn(accountService, 'update').and.callThrough();
            vm.update();
            expect(accountService.update).toHaveBeenCalled();
        });
        it(`create should be called`, () => {
            vm.editing = false;
            spyOn(accountService, 'create').and.callThrough();
            vm.update();
            expect(accountService.create).toHaveBeenCalled();
        });
    });

    describe('function checkFields', () => {
        beforeEach(() => {
            vm.account = {email: 'troll@taylor.edu', user_designation: 1};
        });
        it(`returnValue should be true`, () => {
            let returnValue = vm.checkFields();
            expect(returnValue).toEqual(true);
        });
        it(`returnValue should be false`, () => {
            vm.account.email = '';
            let returnValue = vm.checkFields();
            expect(returnValue).toEqual(false);
        });
        it(`returnValue should be false`, () => {
            vm.account.user_designation = 0;
            let returnValue = vm.checkFields();
            expect(returnValue).toEqual(false);
        });
    });

    describe('function onUserDesignationChanged', () => {
        it(`getPermission should be called`, () => {
            let permissionSetId = 1;
            spyOn(permissionsSetsService, 'getPermission').and.callThrough();
            vm.onUserDesignationChanged(permissionSetId);
            expect(permissionsSetsService.getPermission).toHaveBeenCalled();
        });
    });

    describe('function getButtonText', () => {
        it(`returnValue should equal "Yes"`, () => {
            let has_permission = true;
            let returnValue = vm.getButtonText(has_permission);
            expect(returnValue).toEqual("Yes");
        });
        it(`returnValue should equal "No"`, () => {
            let has_permission = false;
            let returnValue = vm.getButtonText(has_permission);
            expect(returnValue).toEqual("No");
        });
    });

    describe('function getUpdateButtonText', () => {
        it(`returnValue should equal "Update"`, () => {
            vm.editing = true;
            let returnValue = vm.getUpdateButtonText();
            expect(returnValue).toEqual("Update");
        });
        it(`returnValue should equal "Create"`, () => {
            vm.editing = false;
            let returnValue = vm.getUpdateButtonText();
            expect(returnValue).toEqual("Create");
        });
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