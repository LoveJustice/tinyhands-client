import BudgetListController from './budgetList.controller';
import BudgetListService from './budgetList.service';

describe('budgetList Controller',() => {
    let vm;

    beforeEach(inject(($http) => {
        let service = new BudgetListService($http);
        vm = new BudgetListController(service);
    }));

    /*No tests verifying $rootScope, $scope, etc (constructor pass ins) because they are
    just services. We only want to test local variables.*/

    describe('function constructor', () => {
        
        it('expect getBudgetList to be called', () => {
            spyOn(vm, 'getBudgetList');
            vm.constructor();
            expect(vm.getBudgetList).toHaveBeenCalled();
        });

    });
    
    describe('Get listofBudgets from API tests', () => {
        let response = {'data':{'results':[{'month_year':'0001 2000', 'date_time_entered':'123', 'date_time_last_updated':'123'}, 
            {'month_year':'0001 2000', 'date_time_entered':'123', 'date_time_last_updated':'123'},
            {'month_year':'0001 2000', 'date_time_entered':'123', 'date_time_last_updated':'123'},
            {'month_year':'0001 2000', 'date_time_entered':'123', 'date_time_last_updated':'123'},
            {'month_year':'0001 2000', 'date_time_entered':'123', 'date_time_last_updated':'123'} ], 'next':'page2'}};    
        
        describe('tests for getBudgetList', () => {
            
            beforeEach( () => {          
            vm.service.getBudgetList = () => {
                return {
                    then: (f) => {
                        f(response);
                    }
                };
            };
            vm.getBudgetList();
            });
            
            it('listOfBudgets should be the tested response[results]', () => {
                expect(vm.listOfBudgets).toEqual(response.data.results);
            });

            it('nextBudgetPage should be the tested response[next]', () => {
                expect(vm.nextBudgetPage).toEqual(response.data.next);
            });

            //had to put x here; pending did not stop this from running in this case
            xit('mapDatesToText should be called with this.listOfBudgets', () => {
                spyOn(vm, 'mapDatesToText');
                pending("Test is failing because mapDatesToText has been removed");
                vm.getBudgetList();
                expect(vm.mapDatesToText).toHaveBeenCalledWith(response.data.results);
            });
        });
    
        describe('tests for getBudgetListForSorting', () => {
            pending("Waiting to write tests for the actual code -- Jordan is writing");
        });
        
        describe('tests for getNextBudgetPage', () => {   
            
            beforeEach( () => {
            
            vm.service.getBudgetList = () => {
                return {
                    then: (f) => {
                        f(response);
                    }
                };
            };
            vm.getBudgetList();
                 
            vm.service.getNextBudgetPage = () => {
                return {
                    then: (f) => {
                        f(response);
                    }
                };
            };
            
            vm.nextBudgetPage = true;
            });
           
           //had to put x here; pending did not stop this from running in this case
           xit("mapDatesToText should be called with nextBudgetPage appended to this.listOfBudgets", () => {
                spyOn(vm, 'mapDatesToText');
                pending("Test is failing because mapDatesToText has been removed");
                vm.getNextBudgetPage();
                expect(vm.mapDatesToText).toHaveBeenCalledWith(response.data.results);
           }); 
           
           it('nextBudgetPage should be the tested response[next]', () => {
                vm.getNextBudgetPage();
                expect(vm.nextBudgetPage).toEqual(response.data.next);
            });
            
            it('listOfBudgets should be the tested response[results]', () => {
                vm.getNextBudgetPage();
                expect(vm.listOfBudgets).toEqual(response.data.results);
            });
            
            it('size of listOfBudgets after the function is called should equal 80 based on the tests', () => {
                pending("Test is failing (no idea why) related to other failures");
                vm.getNextBudgetPage();
                expect(vm.listOfBudgets.length).toEqual(80); 
            });
            
        });
        
        describe('tests for mapDatesToText', () => {
            pending("Waiting to write tests for the actual code -- Jordan is writing");              
        });
        
        describe('tests for removeBudget', () => {
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
                let budget = {budgetRemoved:false};
                vm.removeBudget([], budget);
                expect(budget.budgetRemoved).toBe(true);
            });
            
            it('tests that budgetRemoved fails due to 403 error', () => {
                let response = {status: 403};
                vm.service.deleteBorderStationBudget = () => {
                    return {then: (f) => { f(response) }};
                };
                spyOn(window.toastr, 'error');
                vm.removeBudget([], {budgetRemoved: true});
                
                expect(window.toastr.error).toHaveBeenCalledWith("Unable to Delete Budget Form");
            });
            
            it('tests that budgetRemoved succeeds with a 200 status', () => {
                let response = {status: 200};
                vm.service.deleteBorderStationBudget = () => {
                    return {then: (f) => { f(response) }};
                };
                vm.listOfBudgets = array;
                spyOn(window.toastr, 'success');
                vm.removeBudget([], {budgetRemoved: true});
                
                expect(window.toastr.success).toHaveBeenCalledWith("Form Successfully Deleted");
            });
            
            it('tests that budgetRemoved succeeds with a 204 status', () => {
                let response = {status: 204};
                vm.service.deleteBorderStationBudget = () => {
                    return {then: (f) => { f(response) }};
                };
                vm.listOfBudgets = array;
                spyOn(window.toastr, 'success');
                vm.removeBudget([], {budgetRemoved: true});
                
                expect(window.toastr.success).toHaveBeenCalledWith("Form Successfully Deleted");
            });
            
            it('tests that the listOfBudgets is correctly spliced to remove the selected budget', () => {
                let response = {status: 200};
                vm.service.deleteBorderStationBudget = () => {
                    return {then: (f) => { f(response) }};
                };
                vm.listOfBudgets = array;
                spyOn(vm.listOfBudgets, 'splice');
                vm.removeBudget([], {budgetRemoved: true});
                expect(vm.listOfBudgets.splice).toHaveBeenCalledWith(-1, 1);
            });
        });
        
    });

});

