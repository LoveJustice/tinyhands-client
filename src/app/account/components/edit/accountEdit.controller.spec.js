import AccountEditController from './accountEdit.controller';

describe('AccountEditController', () => {
    
    let controller,
        rootScope,
        $q,
        mockState,
        mockStateParams,    
        mockAccountService,
        mockPermissionsSetService,
        mockToastr,
        getAccountResponse,
        getPermissionsResponse,
        getPermissionResponse;

    beforeEach(inject((_$q_, $rootScope) => {
        $q = _$q_;
        rootScope = $rootScope;
        mockState = jasmine.createSpyObj('state', ['go']);
        
        mockAccountService = jasmine.createSpyObj('AccountService', ['getAccount','create','update']);
        mockAccountService.getAccount.and.callFake((id) => {
            getAccountResponse = {
                data: {
                    id,
                    email: 'foo@bar.org',
                    first_name: 'Foo',
                    last_name: 'Bar'
                }
            };
            return $q.resolve(getAccountResponse);
        });

        mockAccountService.create.and.callFake((account) => {
            return $q.resolve(account);
        });
        mockAccountService.update.and.callFake((id, account) => {
            return $q.resolve(account);
        });

        mockPermissionsSetService = jasmine.createSpyObj('PermissionsSetService', ['getPermission', 'getPermissions']);
        getPermissionsResponse = {data: {results: [{id: 1, name: 'Foo'}]}};
        mockPermissionsSetService.getPermissions.and.callFake(() => {
            return $q.resolve(getPermissionsResponse);
        });

        mockPermissionsSetService.getPermission.and.callFake((id) => {
            getPermissionResponse = {
                data: {
                    id,
                    name: 'Foo'
                }
            }
            return $q.resolve(getPermissionResponse)
        });

        mockToastr = jasmine.createSpyObj('toastr', ['success']);

        mockStateParams = {id: 2};
            
        controller = new AccountEditController(mockState, mockStateParams, mockAccountService, mockPermissionsSetService, mockToastr);
    }));

    describe('when creating a new account', () => {
        beforeEach(() => {
            mockStateParams = {id: 'create'};
            controller = new AccountEditController(mockState, mockStateParams, mockAccountService, mockPermissionsSetService, mockToastr);
        });

        describe('title', () => {
            it('should return "Create Account"', () => {
                expect(controller.title).toEqual("Create Account");
            });    
        });

        describe('saveButtonText', () => {
            it('should return "Create"', () => {
                expect(controller.saveButtonText).toEqual('Create');
            });

            it('should return "Creating" when save button has been clicked', () => {
                controller.saveButtonClicked = true;

                expect(controller.saveButtonText).toEqual('Creating');
            });
        });

        describe('saveButtonStyle', () => {
            it('should return "btn-success" when save button is clicked', () => {
                controller.saveButtonClicked = true;

                expect(controller.saveButtonStyle).toEqual('btn-success');
            });

            it('should return "btn-primary" when save button is not clicked', () => {
                expect(controller.saveButtonStyle).toEqual('btn-primary');
            });
        });
    });

    describe('when editing an account', () => {        

        describe('title', () => {
            it('should return empty string when account is not loaded', () => {
                expect(controller.title).toEqual("");
            });

            it("should return 'Edit Foo Bar's Account'", () => {
                rootScope.$apply();
                expect(controller.title).toEqual("Edit Foo Bar's Account");
            });    
        });

        describe('saveButtonText', () => {
            it('should return "Update"', () => {
                expect(controller.saveButtonText).toEqual('Update');
            });

            it('should return "Updating" when save button has been clicked', () => {
                controller.saveButtonClicked = true;

                expect(controller.saveButtonText).toEqual('Updating');
            });
        });

        describe('saveButtonStyle', () => {
            it('should return "btn-success" when save button is clicked', () => {
                controller.saveButtonClicked = true;

                expect(controller.saveButtonStyle).toEqual('btn-success');
            });

            it('should return "btn-primary" when save button is not clicked', () => {
                expect(controller.saveButtonStyle).toEqual('btn-primary');
            });
        });
    });

    describe('getPermissions', () => {
        it('should get permissions from PermissionsSetService', () => {
            controller.getPermissions();

            expect(mockPermissionsSetService.getPermissions).toHaveBeenCalled();
        });

        it('should set permissions with response from PermissionsSetService', () => {
            controller.getPermissions();
            rootScope.$apply();

            expect(controller.permissions).toEqual(getPermissionsResponse.data.results);
        });
    });

    describe('retrieveAccount', () => {
        it('should get account with specified id from AccountService', () => {
            let id = 4;
            controller.retrieveAccount(id);

            expect(mockAccountService.getAccount).toHaveBeenCalledWith(id);
        });

        it('should set account with response from AccountService', () => {
            let id = 4;
            controller.retrieveAccount(id);
            rootScope.$apply();

            expect(controller.account).toEqual(getAccountResponse.data);
        });

        it('should show error when account cannot be retrieved', () => {
            
        });
    });

    describe('onUserDesignationChanged', () => {
        describe('when given falsey permissions set id', () => {
            it('should not get permissions set from PermissionsSetService', () => {
                controller.onUserDesignationChanged(null);

                expect(mockPermissionsSetService.getPermission).not.toHaveBeenCalled();
            });
        });

        it('should get permissions set with specified id from PermissionsSetService', () => {
            let id = 2;
            controller.onUserDesignationChanged(id);

            expect(mockPermissionsSetService.getPermission).toHaveBeenCalledWith(id);
        });

        it('should apply permissions to account', () => {
            spyOn(controller, 'applyDesignationToAccount');
            let id = 2;            
            
            controller.onUserDesignationChanged(id)
            rootScope.$apply();

            expect(controller.applyDesignationToAccount).toHaveBeenCalledWith(controller.account, getPermissionResponse.data);
        });
    });

    describe('applyDesignationToAccount', () => {
        it('should set account permissions to match permissions set permissions', () => {
            let permissionsSet = {
                permission_vif_view: true,
                permission_vif_add: true,
                permission_vif_edit: true,
                permission_vif_delete: true
            };

            let account = {
                permission_vif_view: false,
                permission_vif_add: false,
                permission_vif_edit: false,
                permission_vif_delete: false
            }

            controller.applyDesignationToAccount(account, permissionsSet);

            expect(account.permission_vif_view).toEqual(true);
            expect(account.permission_vif_add).toEqual(true);
            expect(account.permission_vif_edit).toEqual(true);
            expect(account.permission_vif_view).toEqual(true);
        });
    });

    describe('updateOrCreate', () => {

        beforeEach(() => {
            controller.account = {
                    id: 2,
                    email: 'foo@bar.org',
                    first_name: 'Foo',
                    last_name: 'Bar',
                    user_designation: 4
                };
        })

        describe('when checkRequiredFieldsHaveValue returns false', () => {
            it('should not update or create account', () => {
                controller.account = {id: 2};

                controller.updateOrCreate();

                expect(mockAccountService.create).not.toHaveBeenCalled();
                expect(mockAccountService.update).not.toHaveBeenCalled();                
            });
        });

        it('should set saveButtonClicked to true', () => {
            controller.updateOrCreate();

            expect(controller.saveButtonClicked).toEqual(true);
        });

        describe('when editing an account', () => {
            beforeEach(() => {
                controller.isEditingAccount = true;
            });

            it('should update account through AccountService', () => {
                controller.updateOrCreate();

                expect(mockAccountService.update).toHaveBeenCalledWith(controller.account.id, controller.account);                
            });

            describe('and account update successful', () => {
                it('should show successful toast message', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();
                    
                    expect(mockToastr.success).toHaveBeenCalledWith("Account Updated");
                });

                it('should set saveButtonClicked to false', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();

                    expect(controller.saveButtonClicked).toEqual(false);
                });

                it('should navigate to list of accounts', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();
                    
                    expect(mockState.go).toHaveBeenCalledWith('accounts.list');
                });
            });

            describe('and account update returns error', () => {
                let error = "bad email";

                beforeEach(() => {
                    mockAccountService.update.and.callFake((id, account) => {
                        return $q.reject({data: {email: [error]}});
                    });
                });

                it('should set saveButtonClicked to false', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();

                    expect(controller.saveButtonClicked).toEqual(false);
                });

                it('should set emailError to response email error', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();

                    expect(controller.emailError).toEqual(error);
                });
            });
        });

        describe('when creating an account', () => {
            beforeEach(() => {
                controller.isEditingAccount = false;
            });

            it('should update account through AccountService', () => {
                controller.updateOrCreate();

                expect(mockAccountService.create).toHaveBeenCalledWith(controller.account);                
            });

            describe('and account creation successful', () => {
                it('should show successful toast message', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();
                    
                    expect(mockToastr.success).toHaveBeenCalledWith("Account Created");
                });

                it('should set saveButtonClicked to false', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();

                    expect(controller.saveButtonClicked).toEqual(false);
                });

                it('should navigate to list of accounts', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();
                    
                    expect(mockState.go).toHaveBeenCalledWith('accounts.list');
                });
            });

            describe('and account creation returns error', () => {
                let error = "bad email";

                beforeEach(() => {
                    mockAccountService.create.and.callFake((account) => {
                        return $q.reject({data: {email: [error]}});
                    });
                });

                it('should set saveButtonClicked to false', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();

                    expect(controller.saveButtonClicked).toEqual(false);
                });

                it('should set emailError to response email error', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();

                    expect(controller.emailError).toEqual(error);
                });
            });
        });

    });

    describe('checkRequiredFieldsHaveValue', () => {
        it('should reset errors', () => {
            spyOn(controller, 'resetErrors');
            controller.account = {id: 2, user_designation: 2};
            

            controller.checkRequiredFieldsHaveValue();

            expect(controller.resetErrors).toHaveBeenCalled();
        });

        describe('when account has no email', () => {
            it('should set error on email', () => {
                controller.account = {id: 2, user_designation: 2};

                controller.checkRequiredFieldsHaveValue();

                expect(controller.emailError).toEqual('An email is required.');
            });

            it('should return false', () => {
                controller.account = {id: 2, user_designation: 2};

                let result = controller.checkRequiredFieldsHaveValue();

                expect(result).toEqual(false);
            });
        });

        describe('when account has no user designation', () => {
            it('should set error on user designation', () => {
                controller.account = {id: 2, email: 'foo@bar.org'};

                controller.checkRequiredFieldsHaveValue();

                expect(controller.userDesignationError).toEqual('A user designation is required.');
            });

            it('should return false', () => {
                controller.account = {id: 2, email: 'foo@bar.org'};

                let result = controller.checkRequiredFieldsHaveValue();

                expect(result).toEqual(false);
            });
        });

        describe('when all required fields filled in', () => {
            it('should return true', () => {
                controller.account = {id: 2, email: 'foo@bar.org', user_designation: 3};

                let result = controller.checkRequiredFieldsHaveValue();

                expect(result).toEqual(true);
            });

            it('should have no error on user designation', () => {
                controller.account = {id: 2, email: 'foo@bar.org', user_designation: 3};

                controller.checkRequiredFieldsHaveValue();

                expect(controller.userDesignationError).toEqual('');
            });
        });

        it('should have no error on email', () => {
                controller.account = {id: 2, email: 'foo@bar.org', user_designation: 3};
            
                controller.checkRequiredFieldsHaveValue();

                expect(controller.emailError).toEqual('');
            });

    });

    describe('resetErrors', () => {
        it('should set emailError to empty string', () => {
            controller.emailError = "Error";
            
            controller.resetErrors();

            expect(controller.emailError).toEqual('');
        });

        it('should set userDesignationError to empty string', () => {
            controller.userDesignationError = "Error";
            
            controller.resetErrors();

            expect(controller.userDesignationError).toEqual('');
        });
    });
});