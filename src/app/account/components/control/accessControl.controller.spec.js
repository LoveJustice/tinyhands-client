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
        response,
        mockPermissionsService,
        mockAccountService,
        mockToastr;

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

        mockAccountService = jasmine.createSpyObj('AccountService', ['getAccounts', 'update']);
        let accountsResponse = { data: [{ id: 1, name: 'Foo' }] };
        mockAccountService.getAccounts.and.callFake(() => {
            return $q.resolve(accountsResponse);
        });

        mockPermissionsService = jasmine.createSpyObj('PermissionsService', ['getPermissions', 'getPermission', 'create', 'update', 'destroy']);

        response = { data: { results: [{ id: 1, name: 'Foo' }] } };
        mockPermissionsService.getPermissions.and.callFake(() => {
            return $q.resolve(response);
        });

        mockToastr = jasmine.createSpyObj('mockToastr', ['error']);

        controller = new AccessControlController(mockAccountService, mockPermissionsService, StickyHeader, $q, mockState, mockUibModal, scope, mockToastr);
    }));

    describe('saveButtonText', () => {
        describe('when saveButtonClicked', () => {
            it('should return "Saving..."', () => {
                controller.saveButtonClicked = true;

                expect(controller.saveButtonText).toEqual('Saving...');
            });
        });

        describe('when accounts has changes', () => {
            it('should return "Save All"', () => {
                rootScope.$apply();
                controller.accounts.items[0].permission_vif_view = true;

                expect(controller.saveButtonText).toEqual('Save All');
            });
        });

        describe('when saveButtonClicked is false and accounts has no changes', () => {
            it('should return "Saved"', () => {
                expect(controller.saveButtonText).toEqual('Saved');
            });
        });
    });

    describe('saveButtonStyle', () => {
        describe('when saveButtonClicked', () => {
            it('should return "btn-success"', () => {
                controller.saveButtonClicked = true;

                expect(controller.saveButtonStyle).toEqual('btn-success');
            });
        });

        describe('when saveButtonClicked is false', () => {
            it('should return "btn-primary"', () => {
                controller.saveButtonClicked = false;

                expect(controller.saveButtonStyle).toEqual('btn-primary');
            });
        });
    });

    describe('createOnStateChangeListener', () => {
        it('should set listener for $stateChangeStart', () => {
            controller.createOnStateChangeListener();

            expect(scope.$on).toHaveBeenCalledWith('$stateChangeStart', jasmine.any(Function));
        });

        describe('when $stateChangeStart event fired and this.permissions.hasChanges', () => {
            it('should call event.preventDefault', () => {
                rootScope.$apply();
                controller.accounts.items[0].permission_vif_view = true;
                controller.createOnStateChangeListener();
                rootScope.$apply();

                expect(mockEvent.preventDefault).toHaveBeenCalled();
            });

            it('should call controller.openUnsavedChangesModal with correct state', () => {
                spyOn(controller, 'openUnsavedChangesModal');
                rootScope.$apply();
                controller.accounts.items[0].permission_vif_view = true;
                controller.createOnStateChangeListener();
                rootScope.$apply();

                expect(controller.openUnsavedChangesModal).toHaveBeenCalledWith(stateName);
            });
        });
    });

    describe('getStyling', () => {
        describe('when called with true', () => {
            it('should return "btn btn-success"', () => {
                let result = controller.getStyling(true);
                expect(result).toEqual('btn btn-success');
            });
        });

        describe('when called with false', () => {
            it('should return "btn btn-danger"', () => {
                let result = controller.getStyling(false);
                expect(result).toEqual('btn btn-danger');
            });
        });
    });

    describe('changeUserRole', () => {

        it('should get permissions by account user desigination', () => {
            let response = {
                data: {
                    permission_vif_view: true,
                    permission_vif_add: true,
                    permission_vif_edit: true,
                    permission_vif_delete: true,
                }
            };
            mockPermissionsService.getPermission.and.callFake(() => {
                return $q.resolve(response);
            });
            let account = { user_designation: "Superuser" };

            controller.changeUserRole(account);

            expect(mockPermissionsService.getPermission).toHaveBeenCalledWith(account.user_designation);
        });

        describe('when permissions returned from PermissionsService', () => {
            it('should apply desigination to account', () => {
                let response = {
                    data: {
                        permission_vif_view: true,
                        permission_vif_add: true,
                        permission_vif_edit: true,
                        permission_vif_delete: true,
                    }
                };
                mockPermissionsService.getPermission.and.callFake(() => {
                    return $q.resolve(response);
                });

                let account = { user_designation: "Superuser" };
                spyOn(controller, 'applyDesignationToAccount')

                controller.changeUserRole(account);
                rootScope.$apply();

                expect(controller.applyDesignationToAccount).toHaveBeenCalledWith(account, response.data);
            });
        });
    });

    describe('applyDesignationToAccount', () => {
        it('should set account permissions to match permissions set', () => {
            let permissionsSet = {
                permission_vif_view: true,
                permission_vif_add: true,
                permission_vif_edit: true,
                permission_vif_delete: true,
            };
            let account = {};

            controller.applyDesignationToAccount(account, permissionsSet);

            expect(account.permission_vif_view).toEqual(true);
            expect(account.permission_vif_add).toEqual(true);
            expect(account.permission_vif_edit).toEqual(true);
            expect(account.permission_vif_delete).toEqual(true);
        });

        it('should not set properties on accounts that do not begin with permission', () => {
            let permissionsSet = {
                foo: true
            };
            let account = {};

            controller.applyDesignationToAccount(account, permissionsSet);

            expect(account.foo).not.toBeDefined();
        });
    });

    describe('discardChanges', () => {
        it('should discard account changes', () => {
            rootScope.$apply();
            spyOn(controller.accounts, 'discardChanges');

            controller.discardChanges();

            expect(controller.accounts.discardChanges).toHaveBeenCalled();
        });
    });

    describe('saveAll', () => {
        it('should set saveButtonClicked to true', () => {
            rootScope.$apply();
            controller.accounts.items[0].user_designation = 'bar';

            controller.saveAll();

            expect(controller.saveButtonClicked).toEqual(true);
        });

        it('should update each account in account.updatedItems', () => {
            spyOn(controller, 'updateAccount')
            rootScope.$apply();
            controller.accounts.items[0].user_designation = 'bar';

            controller.saveAll();

            expect(controller.updateAccount).toHaveBeenCalledWith(controller.accounts.items[0]);
        });

        describe('when all accounts updated', () => {
            it('should set saveButtonClicked to false', () => {
                rootScope.$apply();
                controller.accounts.items[0].user_designation = 'bar';

                controller.saveAll();
                rootScope.$apply();

                expect(controller.saveButtonClicked).toEqual(false);
            });

            it('should save changes to accounts', () => {
                rootScope.$apply();
                controller.accounts.items[0].user_designation = 'bar';
                spyOn(controller.accounts, 'saveChanges');

                controller.saveAll();
                rootScope.$apply();

                expect(controller.accounts.saveChanges).toHaveBeenCalled();
            });
        });

        describe('when an account update fails', () => {
            it('should set saveButtonClicked to false', () => {
                mockAccountService.update.and.callFake(() => {
                    return $q.reject();
                });
                rootScope.$apply();
                controller.accounts.items[0].user_designation = 'bar';

                controller.saveAll();
                rootScope.$apply();

                expect(controller.saveButtonClicked).toEqual(false);
            });

            it('should show toastr error', () => {
                mockAccountService.update.and.callFake(() => {
                    return $q.reject();
                });
                rootScope.$apply();
                controller.accounts.items[0].user_designation = 'bar';

                controller.saveAll();
                rootScope.$apply();

                expect(mockToastr.error).toHaveBeenCalledWith("One or more Account Settings could not be saved");
            });
        });

    });

    describe('updateAccount', () => {
        it('should call AccountService.update with account.id and account', () => {
            let account = { id: 1, name: 'Bob' };

            controller.updateAccount(account);

            expect(mockAccountService.update).toHaveBeenCalledWith(account.id, account);
        });
    });

    describe('openUnsavedChangesModal', () => {
        it('should open modal with correct options', () => {
            let modalOptions = {
                templateUrl: 'app/account/components/modal/unsavedChangesModal.html',
                controller: 'UnsavedChangesModalController',
                controllerAs: 'UnsavedChangesModalCtrl'
            };

            controller.openUnsavedChangesModal();

            expect(mockUibModal.open).toHaveBeenCalledWith(modalOptions);
        });

        describe('when user decides to discard changes', () => {
            it('should discard changes', () => {
                spyOn(controller, 'discardChanges');
                rootScope.$apply();

                controller.openUnsavedChangesModal();
                rootScope.$apply();

                expect(controller.discardChanges).toHaveBeenCalled();
            });
        });

        describe('when user decides to save', () => {
            it('should call controller.saveAll', () => {
                mockUibModal.open.and.callFake(() => {
                    return { result: $q.resolve(true) };
                });
                spyOn(controller, 'saveAll');
                controller.saveAll.and.callFake(() => { return $q.resolve(true) });
                rootScope.$apply();

                controller.openUnsavedChangesModal();
                rootScope.$apply();

                expect(controller.saveAll).toHaveBeenCalled();
            });
        });

        describe('when toState is not null', () => {
            it('should go to state', () => {
                let toState = "fooState";
                rootScope.$apply();

                controller.openUnsavedChangesModal(toState);
                rootScope.$apply();

                expect(mockState.go).toHaveBeenCalledWith(toState);
            });
        });
    });
});