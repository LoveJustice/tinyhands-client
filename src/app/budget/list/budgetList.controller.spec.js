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

            it('mapDatesToText should be called with this.listOfBudgets', () => {
                spyOn(vm, 'mapDatesToText');
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
            
           it("mapDatesToText should be called with nextBudgetPage appended to this.listOfBudgets", () => {
                spyOn(vm, 'mapDatesToText');
                vm.getNextBudgetPage();
                expect(vm.mapDatesToText).toHaveBeenCalledWith(response.data.results);
           }); 
           
           it('nextBudgetPage should be the tested response[next]', () => {
                vm.getNextBudgetPage();
                expect(vm.nextBudgetPage).toEqual(response.data.next);
            });
            
            it('listOfBudgets should be the tested response[results]', () => {
                expect(vm.listOfBudgets).toEqual(response.data.results);
            });
            
            it('size of listOfBudgets after the function is called should equal 40 based on the tests', () => {
                vm.getNextBudgetPage();
                expect(vm.listOfBudgets.length).toEqual(40); 
            });
        });
    });

});

