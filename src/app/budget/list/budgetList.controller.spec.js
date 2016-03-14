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
        
        //This might break other tests, I don't know without writing other tests
        beforeEach( () => {          
            vm.service.getBudgetList = () => {
                return {
                    then: (f) => {
                        f(response);
                    }
                }
            }
        });
        
        describe('tests for getBudgetList', () => {
            beforeEach( () => {
                vm.getBudgetList();
            });
        
            it('listOfBudgets should be tested response', () => {
                expect(vm.listOfBudgets).toEqual(response.data.results);
            });

            it('nextBudgetPage should be tested response', () => {
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
           it("if nextBudgetpage set, should push on the next page of results to list of budgets", () => {
               vm.nextBudgetPage = true;
               vm.getNextBudgetPage();
               //need to finish test with expect statement and checking when receiving results from the nextBudgetPage
           }); 
        });
    });

});

