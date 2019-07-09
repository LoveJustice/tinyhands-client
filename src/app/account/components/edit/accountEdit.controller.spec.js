import AccountEditController from './accountEdit.controller';
import PermDropDownGroup from './accountEdit.controller';
var pdg = require('./accountEdit.controller.js');

describe ('PermDropDownGroup', () => {
    let controller = null;
    
    beforeEach(inject(() => {
        let permission = {
                id:32,
                action:'VIEW',
                min_level:'STATION'
        };
        
        let managePermissions = [];
        let allCurrentPermissions = [];
        let allCountries = [];
        let allStations = [];
        let accountId = 10032;
        
        controller = new pdg.PermDropDownGroup(permission, managePermissions, allCountries, allStations, allCurrentPermissions, accountId);
    }));
    
    describe('find country for station', () => {
        let stations = [
            {
                id: 5,
                operating_country:10
            },
            {
                id: 7,
                operating_country:10
            },
            {
                id: 9,
                operating_country:12
            },
            
        ];
        it('country found', () => {
            let country = controller.findStationCountry(7, stations);
            expect(country).toEqual(10);
        });
        it('country not found found', () => {
            let country = controller.findStationCountry(8, stations);
            expect(country).toEqual(null);
        });
    });
    
    describe('Check for global account management', () => {
        it('global account management found', () => {
            let managementPermissions = [
                {
                    country:1,
                    station:null
                },
                {
                    country:null,
                    station:10
                },
                {
                    country:null,
                    station:null
                },
                {
                    country:null,
                    station:12
                }
            ];
            
            let rv = controller.globalManagePermission(managementPermissions);
            expect(rv).toEqual(true);
            
        });
        it('country management not found', () => {
            let managementPermissions = [
                {
                    country:1,
                    station:null
                },
                {
                    country:null,
                    station:10
                },
                {
                    country:2,
                    station:null
                },
                {
                    country:null,
                    station:12
                }
            ];
            
            let rv = controller.globalManagePermission(managementPermissions);
            expect(rv).toEqual(false);
        });
        
    });
    
    describe('Check if user permission should be displayed', () => {
        let stations, managePermissions;
        beforeEach(() =>{
            stations=[
                {
                    id: 5,
                    operating_country:1
                },
                {
                    id: 10,
                    operating_country:3
                },
                {
                    id: 12,
                    operating_country:2
                },
            ];
            managePermissions = [
                {
                    country:1,
                    station:null
                },
                {
                    country:null,
                    station:10
                },
                {
                    country:2,
                    station:null
                },
                {
                    country:null,
                    station:12
                }
            ];
        });
        
        it('management country and user country match', () => {
            let userPermission = {
                country: 2,
                station: null
            };
            
            let rv = controller.displayPermission(userPermission, managePermissions, stations);
            expect(rv).toEqual(true);
        });
        
        it('management station -> country and user country match', () => {
            let userPermission = {
                country: 3,
                station: null
            };
            
            let rv = controller.displayPermission(userPermission, managePermissions, stations);
            expect(rv).toEqual(true);
        });
        
        it('management station -> country and user country match', () => {
            let userPermission = {
                country: 3,
                station: null
            };
            
            let rv = controller.displayPermission(userPermission, managePermissions, stations);
            expect(rv).toEqual(true);
        });
        
        it('management station and user station match', () => {
            let userPermission = {
                country: null,
                station: 10
            };
            
            let rv = controller.displayPermission(userPermission, managePermissions, stations);
            expect(rv).toEqual(true);
        });
        
        it('management station and user station -> country match', () => {
            let userPermission = {
                country: null,
                station: 5
            };
            
            let rv = controller.displayPermission(userPermission, managePermissions, stations);
            expect(rv).toEqual(true);
        });
        
        it('nothing matches', () => {
            let userPermission = {
                country: 4,
                station: null
            };
            
            let rv = controller.displayPermission(userPermission, managePermissions, stations);
            expect(rv).toEqual(false);
        });
        
    });
    
    it('Filter countries', () => {
        let allCountries=[
            {id:1},
            {id:2},
            {id:3},
            {id:4},
            {id:5},
            {id:6},
            {id:7},
            {id:8},
            {id:9},
            {id:10},
        ];
        let currentPermissions=[
            {country:1, station:null},
            {country:null, station:10}
        ];
        let managePermissions = [
            {country:2,station:null},
            {country:null, station:20}
        ];
        let filteredStations = [
            {id:5, operating_country:1},
            {id:7, operating_country:2},
            {id:10, operating_country:7},
            {id:15, operating_country:8},
            {id:20, operating_country:9},
            {id:25, operating_country:10},
        ];
        let filteredCountries = [
            {id:1},
            {id:2},
            {id:7},
            {id:9}
        ];
        let theCountries = controller.filterCountries(allCountries, currentPermissions, managePermissions, filteredStations);
        expect(theCountries).toEqual(filteredCountries);
    });
    
    it('filter out stations', () => {
        let allStations = [
            {
                id:10,
                operating_country:3
            },
            {
                id:11,
                operating_country:7
            },
            {
                id:12,
                operating_country:1
            },
            {
                id:20,
                operating_country:7
            },
            {
                id:21,
                operating_country:2
            }
        ];
        let currentPermissions = [
            {
                station:10,
                country:null
            },
            {
                station:null,
                country:1
            }
        ];
        let managePermissions = [
            {
                station:20,
                country:null
            },
            {
                station:null,
                country:2
            }
        ];
        let filteredStations = [
            {
                id:10,
                operating_country:3
            },
            {
                id:12,
                operating_country:1
            },
            {
                id:20,
                operating_country:7
            },
            {
                id:21,
                operating_country:2
            }
        ];
        
        let theStations = controller.filterStations(allStations, currentPermissions, managePermissions);
        expect(theStations).toEqual(filteredStations);
    });
});

describe('AccountEditController', () => {

    let controller,
        rootScope,
        $q,
        mockState,
        mockStateParams,
        mockAccountService,
        mockSessionService,
        mockUserPermissionsService,
        mockToastr,
        getAccountResponse,
        getPermissionsResponse,
        getPermissionResponse,
        userPermissionsGetPermissionsResponse,
        getUserPermissionsResponse,
        getCountriesResponse,
        getBorderStationsResponse;

    beforeEach(inject((_$q_, $rootScope) => {
        $q = _$q_;
        rootScope = $rootScope;
        mockState = jasmine.createSpyObj('state', ['go']);

        mockAccountService = jasmine.createSpyObj('AccountService', ['getAccount', 'create', 'update']);
        mockAccountService.getAccount.and.callFake((id) => {
            if (id == 100) {
                return $q.reject({ status: 404 });
            }
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

        mockSessionService = jasmine.createSpyObj('SessionService',['getUserPermissionList', 'checkPermission']);
        var user = Object();
        user.id = 10022;
        mockSessionService.user = user;
        mockSessionService.getUserPermissionList.and.callFake((a,b) => {
            return [{account:10, country: null, station: null, permission:23}];
        });
        mockSessionService.checkPermission.and.callFake((a,b) => {
            return true;
        });

        userPermissionsGetPermissionsResponse = { data:{ results: [{id:1, permission_group:'IRF', action:'VIEW', min_level:'STATION'}, {id:2, permission_group:'VIF', action:'ADD', min_level: 'STATION'}]}};
        mockUserPermissionsService = jasmine.createSpyObj('UserPermissionsService',['getPermissions', 'getUserPermissions', 'setUserPermissions', 'getAllCountries', 'getBorderStations']);
        mockUserPermissionsService.getPermissions.and.callFake(() => {
                return $q.resolve(userPermissionsGetPermissionsResponse);
        });
        mockUserPermissionsService.getPermissions.and.callFake(() => {
            return $q.resolve(userPermissionsGetPermissionsResponse);
        });

        getUserPermissionsResponse = { data: [{account:10022, country:null, station:null, permission:1}, {account:10022, country:1, station:null, permission:2}]};
        mockUserPermissionsService.getUserPermissions.and.callFake((id) => {
                return $q.resolve(getUserPermissionsResponse);
        });
        mockUserPermissionsService.setUserPermissions.and.callFake((id, data) => {
                return $q.resolve(data);
        });

        getCountriesResponse = { data: {results: [{id:1, name:'Nepal'}, {id:2, name:'South Africa'}]}};
        mockUserPermissionsService.getAllCountries.and.callFake(() => {
                return $q.resolve(getCountriesResponse);
        });

        getBorderStationsResponse = { data: [{id:1, station_name:'Station1', operating_country:1}, {id:2, station_name:'Station2', operating_country:2}]};
        mockUserPermissionsService.getBorderStations.and.callFake(() => {
                return $q.resolve(getBorderStationsResponse);
        });

        mockToastr = jasmine.createSpyObj('toastr', ['success']);

        mockStateParams = { id: 2 };

        controller = new AccountEditController(mockState, mockStateParams, mockAccountService, mockSessionService, mockUserPermissionsService, mockToastr);
    }));

    describe('when creating a new account', () => {
        beforeEach(() => {
            mockStateParams = { id: 'create' };
            controller = new AccountEditController(mockState, mockStateParams, mockAccountService, mockSessionService, mockUserPermissionsService, mockToastr);
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
            it('should get permissions from UserLocationPermissionsService', () => {
                controller.getPermissions();

                expect(mockUserPermissionsService.getPermissions).toHaveBeenCalled();
            });

            it('should set permissions with response from UserLocationPermissionsService', () => {
                controller.getPermissions();
                rootScope.$apply();

                expect(controller.permissions).toEqual(userPermissionsGetPermissionsResponse.data.results);
                expect(controller.havePermissions).toEqual(true);
            });
    });

    describe('getUserPermissions', () => {
        it('should get user permissions from UserLocationPermissionsService', () => {
            controller.getUserPermissions(10022);

            expect(mockUserPermissionsService.getUserPermissions).toHaveBeenCalled();
        });

        it('should set permissions with response from UserLocationPermissionsService', () => {
            controller.getUserPermissions(10022);
            rootScope.$apply();

            expect(controller.existingUserPermissions).toEqual(getUserPermissionsResponse.data);
            expect(controller.haveUserPermissions).toEqual(true);
        });
    });

    describe('getCountries', () => {
        it('should get countries from UserLocationPermissionsService', () => {
            controller.getCountries();

            expect(mockUserPermissionsService.getAllCountries).toHaveBeenCalled();
        });

        it('should set countries with response from UserLocationPermissionsService', () => {
            controller.getCountries();
            rootScope.$apply();

            expect(controller.countries).toEqual(getCountriesResponse.data.results);
            expect(controller.haveCountries).toEqual(true);
        });
    });

    describe('getStations', () => {
        it('should get stations from UserLocationPermissionsService', () => {
            controller.getStations();

            expect(mockUserPermissionsService.getBorderStations).toHaveBeenCalled();
        });

        it('should set permissions with response from UserLocationPermissionsService', () => {
            controller.getStations();
            rootScope.$apply();

            expect(controller.stations).toEqual(getBorderStationsResponse.data);
            expect(controller.haveStations).toEqual(true);
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

        it('when account cannot be found should go to accountNotFound state', () => {
            let id = 100;
            controller.retrieveAccount(id);
            rootScope.$apply();

            expect(mockState.go).toHaveBeenCalledWith('accountNotFound');
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
                controller.account = { id: 2 };

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
                        return $q.reject({ data: { error_text: error } });
                    });
                });

                it('should set saveButtonClicked to false', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();

                    expect(controller.saveButtonClicked).toEqual(false);
                });

                it('should set error_text to response email error', () => {
                    controller.updateOrCreate();
                    rootScope.$apply();

                    expect(controller.errorText).toEqual(error);
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
                        return $q.reject({ data: { error_text: error } });
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

                    expect(controller.errorText).toEqual(error);
                });
            });
        });

    });

    describe('checkRequiredFieldsHaveValue', () => {
        it('should reset errors', () => {
            spyOn(controller, 'resetErrors');
            controller.account = { id: 2, user_designation: 2 };


            controller.checkRequiredFieldsHaveValue();

            expect(controller.resetErrors).toHaveBeenCalled();
        });

        describe('when account has no email', () => {
            it('should set error on email', () => {
                controller.account = { id: 2, user_designation: 2 };

                controller.checkRequiredFieldsHaveValue();

                expect(controller.emailError).toEqual('An email is required.');
            });

            it('should return false', () => {
                controller.account = { id: 2, user_designation: 2 };

                let result = controller.checkRequiredFieldsHaveValue();

                expect(result).toEqual(false);
            });
        });

        describe('when all required fields filled in', () => {
            it('should return true', () => {
                controller.account = { id: 2, email: 'foo@bar.org', user_designation: 3 };

                let result = controller.checkRequiredFieldsHaveValue();

                expect(result).toEqual(true);
            });
        });

        it('should have no error on email', () => {
            controller.account = { id: 2, email: 'foo@bar.org', user_designation: 3 };

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
    });
});
