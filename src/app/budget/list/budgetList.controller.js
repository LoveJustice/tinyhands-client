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
    constructor(BudgetListService, SessionService, StickyHeader, toastr, $state, $uibModal, $stateParams, $timeout, SpinnerOverlayService) {
        'ngInject';
        this.service = BudgetListService;
        this.session = SessionService;
        this.sticky = StickyHeader;
        this.toastr = toastr;
        this.state = $state;
        this.modal = $uibModal;
        this.stateParams = $stateParams;
        this.timeout = $timeout;
        this.spinnerOverlayService = SpinnerOverlayService;
        
        this.timer = {};

        this.searchTerm = '';
        this.countryIds = '';
        this.sortValue = 'month_year';
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;

        this.hasAddPermission = true;
        this.listOfBudgets = [];
        
        this.paginate = {
            items:0,
            pageSize:25,
            currentPage:1,
        };
        
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
            if ($stateParams.search) {
                this.searchTerm = $stateParams.search;
            }
            if ($stateParams.countryIds) {
                this.countryIds = $stateParams.countryIds;
            }
        }
        
        this.getUserCountries();
        this.getBudgetList(this.searchTerm, this.sortValue);
    }
    
    extractPage(url) {
        try {
            return url
                .slice(url.indexOf('page='))
                .split('&')[0]
                .split('=')[1];
        } catch (e) {
            return 0;
        }
    }
    
    getBudgetListInternal() {
        this.showPage(1);
    }
    
    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for MDFs...");        
        this.service.getBudgetList(this.searchTerm, this.sortValue, this.countryIds, pageNumber).then( (promise) => {
            this.listOfBudgets = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();
        });
    }

    /**
     * Gets list of budgets from API.
     */
    getBudgetList(searchTerm, sortValue) {
        if (searchTerm !== null) {
            this.searchTerm = searchTerm;
        }
            if (sortValue !== null) {
            if (this.sortValue === sortValue) {
                this.sortValue = `-${sortValue}`;
            } else {
                this.sortValue = sortValue;
            }
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
        this.service.getBudgetList(this.searchTerm, this.sortValue, this.countryIds, this.nextBudgetPage).then((response) => {
            this.listOfBudgets = this.listOfBudgets.concat(response.data.results);
            this.nextBudgetPage = this.extractPage(response.data.next);
        });
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