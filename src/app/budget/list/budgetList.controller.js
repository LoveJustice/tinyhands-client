/**
 * (description)
 *
 * @export
 * @class BudgetList
 */
export default class BudgetList {
    /**
     * Creates an instance of BudgetList.
     *
     * @param BudgetListService (set of functions that controls data flow from front-end to back-end)
     * @param session (user session data)
     */
    constructor(BudgetListService, SessionService) {
        'ngInject';

        this.service = BudgetListService;
        this.session = SessionService;

        this.searchTerm = '';
        this.sortValue = 'month_year';

        this.getBudgetList(this.searchTerm, this.sortValue);
    }

    /**
     * Gets list of budgets from API.
     */
    getBudgetList(searchTerm, sortValue) {
        this.searchTerm = searchTerm;
        if (this.sortValue === sortValue) {
            this.sortValue = `-${sortValue}`;
        } else {
            this.sortValue = sortValue;
        }
        this.service.getBudgetList(this.searchTerm, this.sortValue).then((response) => {
            this.listOfBudgets = response.data.results;
            this.nextBudgetPage = response.data.next;
        });
    }

    getNextBudgetPage() {
        if (this.nextBudgetPage) {
            this.service.getNextBudgetPage(this.nextBudgetPage).then((response) => {
                response.data.results.forEach(function (element) {
                    this.listOfBudgets.push(element);
                }, this);
                this.nextBudgetPage = response.data.next;
            });
        }
    }

    /**
     * Removes a budget from the Database if it has been confirmed.
     *
     * @param array (list of all budgets from database)
     * @param budget (budget to be removedd)
     */
    removeBudget(array, budget) {
        if (budget.budgetRemoved) {
            this.service.deleteBorderStationBudget(budget.id).then((response) => {
                if (response.status === 204 || response.status === 200) {
                    window.toastr.success("Form Successfully Deleted");
                    var index = this.listOfBudgets.indexOf(budget);
                    this.listOfBudgets.splice(index, 1);
                } else {
                    window.toastr.error("Unable to Delete Budget Form");
                }
            });
        } else {
            budget.budgetRemoved = true;
        }
    }

}