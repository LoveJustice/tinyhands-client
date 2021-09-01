import BudgetListController from './budgetList.controller';
import BudgetListService from './budgetList.service';

describe('budgetList Controller', () => {
    let vm,
        MockSessionService,
        MockStickyHeader,
        mockToastr,
        MockSpinnerOverlayService,
        $state,
        $stateParams,
        $timeout,
        $uibModal,
        http;

    beforeEach(inject(($http, _$state_, _$timeout_) => {
        http = $http;
        $state = _$state_;
        $timeout = _$timeout_;
        $stateParams = {"search": "BHD"};
        MockSessionService = jasmine.createSpyObj('SessionService', ['attemptLogin', 'getUserPermissionList']);
        var user = Object();
        user.id = 10022;
        MockSessionService.user = user;
        MockSessionService.getUserPermissionList.and.callFake((a,b) => {
            return [{account:10, country: null, station: null, permission:23}];
        });
        MockStickyHeader = jasmine.createSpyObj('StickyHeader', ['stickyOptions']);
        MockSpinnerOverlayService = jasmine.createSpyObj('SpinnerOverlayService', ['show', 'hide']);
        mockToastr = jasmine.createSpyObj('toastr', ['success', 'error']);

        let service = new BudgetListService($http);
        vm = new BudgetListController(service, MockSessionService, MockStickyHeader, mockToastr, $state, $uibModal, $stateParams, $timeout, MockSpinnerOverlayService);
    }));

    /*No tests verifying $rootScope, $scope, etc (constructor pass ins) because they are
    just services. We only want to test local variables.*/

    describe('function constructor', () => {
        it('expect getUserCountries to be called', () => {
            spyOn(vm, 'getUserCountries');
            let service = new BudgetListService(http);
            vm.constructor(service, {}, {stickyOptions:{}}, {}, $state, $uibModal, $stateParams, $timeout, MockSpinnerOverlayService);
            expect(vm.getUserCountries).toHaveBeenCalled();
        });
    });

    describe('function listofBudgets', () => {
        let response = {
            'data': {
                'results': [{ 'month_year': '0001 2000', 'date_time_entered': '123', 'date_time_last_updated': '123' },
                { 'month_year': '0001 2000', 'date_time_entered': '123', 'date_time_last_updated': '123' },
                { 'month_year': '0001 2000', 'date_time_entered': '123', 'date_time_last_updated': '123' },
                { 'month_year': '0001 2000', 'date_time_entered': '123', 'date_time_last_updated': '123' },
                { 'month_year': '0001 2000', 'date_time_entered': '123', 'date_time_last_updated': '123' }], 'next': 'page=2'
            }
        };

        describe('function getBudgetList', () => {
            beforeEach(() => {
                vm.service.getBudgetList = () => {
                    return {
                        then: (f) => {
                            f(response);
                        }
                    };
                };
            });

            describe('tests that getBudgetList sets responses', () => {
                it('listOfBudgets should be the tested response[results]', () => {
                    vm.getBudgetList();
                    expect(vm.listOfBudgets).toEqual(response.data.results);
                });
            });

            describe('tests all possible combinations of sortValue', () => {
                it('tests that sortValue gets set', () => {
                    vm.getBudgetList(null, 'month_year');
                    expect(vm.sortValue).toBe('month_year');
                });
                it('sets sortValue is set to be in reverse', () => {
                    vm.sortValue = '-month_year';
                    vm.getBudgetList(null, 'month_year');
                    expect(vm.sortValue).toBe('month_year');
                });
                it('tests that sortValue gets set', () => {
                    vm.getBudgetList(null, 'border_station__station_name');
                    expect(vm.sortValue).toBe('border_station__station_name');
                });
                it('sets sortValue to set to be in reverse', () => {
                    vm.sortValue = '-border_station__station_name';
                    vm.getBudgetList(null, 'border_station__station_name');
                    expect(vm.sortValue).toBe('border_station__station_name');
                });
                it('sets sortValue to set to be in reverse', () => {
                    vm.sortValue = 'border_station__station_name';
                    vm.getBudgetList(null, '-border_station__station_name');
                    expect(vm.sortValue).toBe('-border_station__station_name');
                });
            });
        });

        describe('function removeBudget', () => {
            let array = [
                {
                    "id": 8,
                    "border_station": {
                        "id": 24,
                        "station_code": "KTM",
                        "station_name": "Kathmandu",
                        "date_established": "2014-07-01",
                        "has_shelter": false,
                        "latitude": 27.7,
                        "longitude": 85.333,
                        "open": true
                    },
                    "month_year": "2016-04-15T00:00:00Z",
                    "date_time_entered": "2016-03-03T20:19:41.652688Z",
                    "date_time_last_updated": "2016-03-03T20:19:41.652709Z"
                },
                {
                    "id": 9,
                    "border_station": {
                        "id": 5,
                        "station_code": "DNG",
                        "station_name": "Dang",
                        "date_established": "2012-10-01",
                        "has_shelter": true,
                        "latitude": 27.8562,
                        "longitude": 82.5131,
                        "open": true
                    },
                    "month_year": "2016-04-15T00:00:00Z",
                    "date_time_entered": "2016-03-03T20:19:51.375322Z",
                    "date_time_last_updated": "2016-03-03T20:19:51.375346Z"
                },
                {
                    "id": 11,
                    "border_station": {
                        "id": 15,
                        "station_code": "MHN",
                        "station_name": "Mahendranagar",
                        "date_established": null,
                        "has_shelter": false,
                        "latitude": 28.987146,
                        "longitude": 80.165191,
                        "open": true
                    },
                    "month_year": "2016-04-15T00:00:00Z",
                    "date_time_entered": "2016-03-03T20:20:21.503458Z",
                    "date_time_last_updated": "2016-03-03T20:20:21.503480Z"
                }
            ];

            it('tests that budgetRemoved set to true by the second conditional', () => {
                let budget = { budgetRemoved: false };
                vm.removeBudget([], budget);
                expect(budget.budgetRemoved).toBe(true);
            });

            it('tests that budgetRemoved fails due to 403 error', () => {
                let response = { status: 403 };
                vm.service.deleteBorderStationBudget = () => {
                    return { then: (f) => { f(response) } };
                };
                vm.removeBudget([], { budgetRemoved: true });

                expect(mockToastr.error).toHaveBeenCalledWith("Unable to Delete Budget Form");
            });

            it('tests that budgetRemoved succeeds with a 200 status', () => {
                let response = { status: 200 };
                vm.service.deleteBorderStationBudget = () => {
                    return { then: (f) => { f(response) } };
                };
                vm.listOfBudgets = array;
                vm.removeBudget([], { budgetRemoved: true });

                expect(mockToastr.success).toHaveBeenCalledWith("Form Successfully Deleted");
            });

            it('tests that budgetRemoved succeeds with a 204 status', () => {
                let response = { status: 204 };
                vm.service.deleteBorderStationBudget = () => {
                    return { then: (f) => { f(response) } };
                };
                vm.listOfBudgets = array;
                vm.removeBudget([], { budgetRemoved: true });

                expect(mockToastr.success).toHaveBeenCalledWith("Form Successfully Deleted");
            });

            it('tests that the listOfBudgets is correctly spliced to remove the selected budget', () => {
                let response = { status: 200 };
                vm.service.deleteBorderStationBudget = () => {
                    return { then: (f) => { f(response) } };
                };
                vm.listOfBudgets = array;
                spyOn(vm.listOfBudgets, 'splice');
                vm.removeBudget([], { budgetRemoved: true });
                expect(vm.listOfBudgets.splice).toHaveBeenCalledWith(-1, 1);
            });
        });

    });

});

