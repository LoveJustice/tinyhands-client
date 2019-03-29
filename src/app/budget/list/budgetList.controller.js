/**
 * (description)
 *
 * @export
 * @class BudgetList
 */
import createBudgetModalTemplate from './createBudgetModal.html';

export default class BudgetList {
    /**
     * Creates an instance of BudgetList.
     *
     * @param BudgetListService (set of functions that controls data flow from front-end to back-end)
     * @param session (user session data)
     */
    constructor(BudgetListService, SessionService, StickyHeader, toastr, $state, $uibModal, $stateParams, $timeout) {
        'ngInject';
        this.service = BudgetListService;
        this.session = SessionService;
        this.sticky = StickyHeader;
        this.toastr = toastr;
        this.state = $state;
        this.modal = $uibModal;
        this.stateParams = $stateParams;
        this.timeout = $timeout;
        
        this.timer = {};

        this.searchTerm = '';
        this.countryIds = '';
        this.sortValue = 'month_year';
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;

        this.hasAddPermission = true;
        this.listOfBudgets = [];
        
        this.countryDropDown = {};
        this.countryDropDown.options = [];
        this.countryDropDown.selectedOptions = [];
        this.countryDropDown.settings = {
            smartButtonMaxItems: 2,
            showCheckAll: false,
            showUncheckAll: false,
        };
        this.countryDropDown.customText = { buttonDefaultText: 'All' };
        this.countryDropDown.eventListener = {
            onItemSelect: this.countryChange,
            onItemDeselect: this.countryChange,
            onSelectAll: this.countryChange,
            onDeselectAll: this.countryChange,
            ctrl: this,
        };
        
        if ($stateParams) {
            this.searchTerm = $stateParams.search;
            this.countryIds = $stateParams.countryIds;
        }
        
        this.getUserCountries();
        this.getBudgetList(this.searchTerm, this.sortValue);
    }
    
    getBudgetListInternal() {
        this.service.getBudgetList(this.searchTerm, this.sortValue, this.countryIds).then((response) => {
            this.listOfBudgets = response.data.results;
            this.nextBudgetPage = response.data.next;
        });
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
        this.getBudgetListInternal();
        this.timer = this.timeout(() => {
            this.state.go('.', {
                search: this.searchTerm,
                countryIds: this.countryIds,
            });
        }, 500);
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
    
    createBudget() {
        let modalInstance = this.modal.open({
            animation: true,
            templateUrl: createBudgetModalTemplate,
            controller: 'CreateBudgetModalController as vm',
            size: 'md',
        });
        modalInstance.result.then(station => {
            this.state.go('budget', {
                borderStationId: station.id,
                isViewing: false,
            });
        });
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
                    this.toastr.success("Form Successfully Deleted");
                    let index = this.listOfBudgets.indexOf(budget);
                    this.listOfBudgets.splice(index, 1);
                } else {
                    this.toastr.error("Unable to Delete Budget Form");
                }
            });
        } else {
            budget.budgetRemoved = true;
        }
    }
    
    getUserCountries() {
        this.service.getUserCountries(this.session.user.id).then(promise => {
            this.countries = promise.data;
            this.countryDropDown.options = [];
            for (let idx = 0; idx < this.countries.length; idx++) {
                this.countryDropDown.options.push({
                    id: this.countries[idx].id,
                    label: this.countries[idx].name,
                });
            }
            
            this.countryDropDown.options = _.sortBy( this.countryDropDown.options, 'label' );
            if (this.countryIds) {
                let countryArry = this.countryIds.split(',');
                for (let idx1 in countryArry) {
                    let countryId = parseInt(countryArry[idx1]);
                    for (let idx=0; idx < this.countryDropDown.options.length; idx++) {
                        if (countryId === this.countryDropDown.options[idx].id) {
                            this.countryDropDown.selectedOptions.push(this.countryDropDown.options[idx]);
                        }
                    }
                }
            }
        });
    }

    countryChange() {
        var selectedCountries = '';
        var sep = '';
        var ctrl = this.ctrl;
        for (var idx = 0; idx < ctrl.countryDropDown.selectedOptions.length; idx++) {
            selectedCountries = selectedCountries + sep + ctrl.countryDropDown.selectedOptions[idx].id;
            sep = ',';
        }
        this.ctrl.countryIds = selectedCountries;
        this.ctrl.getBudgetList(this.searchTerm, this.sortValue);
    }
}