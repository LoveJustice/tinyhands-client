/**
 * (description)
 *
 * @export
 * @class MdfList
 */
import createMdfModalTemplate from './createMdfModal.html';

export default class MdfList {
    /**
     * Creates an instance of MdfList.
     *
     * @param MdfListService (set of functions that controls data flow from front-end to back-end)
     * @param session (user session data)
     */
    constructor(MdfListService, SessionService, StickyHeader, toastr, $state, $uibModal, $stateParams, $timeout, SpinnerOverlayService) {
        'ngInject';
        this.service = MdfListService;
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
        this.listOfMdfs = [];
        
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
        this.getMdfList(this.searchTerm, this.sortValue);
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
    
    getMdfListInternal() {
        this.showPage(1);
    }
    
    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for MDFs...");        
        this.service.getMdfList(this.searchTerm, this.sortValue, this.countryIds, pageNumber).then( (promise) => {
            this.listOfMdfs = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();
        });
    }

    /**
     * Gets list of mdfs from API.
     */
    getMdfList(searchTerm, sortValue) {
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
        this.getMdfListInternal();
        this.timer = this.timeout(() => {
            this.state.go('.', {
                search: this.searchTerm,
                countryIds: this.countryIds,
            });
        }, 500);
    }

    getNextMdfPage() {
        this.service.getMdfList(this.searchTerm, this.sortValue, this.countryIds, this.nextMdfPage).then((response) => {
            this.listOfMdfs = this.listOfMdfs.concat(response.data.results);
            this.nextMdfPage = this.extractPage(response.data.next);
        });
    }
    
    createMdf() {
        let modalInstance = this.modal.open({
            animation: true,
            templateUrl: createMdfModalTemplate,
            controller: 'CreateMdfModalController as vm',
            size: 'md',
        });
        modalInstance.result.then(mdf => {
            this.state.go('mdf-pr', {
            	id: mdf.id,
                borderStationId: mdf.border_station,
                isViewing: false,
            });
        });
    }

    /**
     * Removes a mdf from the Database if it has been confirmed.
     *
     * @param array (list of all mdfs from database)
     * @param mdf (mdf to be removedd)
     */
    removeMdf(array, mdf) {
        if (mdf.mdfRemoved) {
            this.service.deleteBorderStationMdf(mdf.id).then((response) => {
                if (response.status === 204 || response.status === 200) {
                    this.toastr.success("Form Successfully Deleted");
                    let index = this.listOfMdfs.indexOf(mdf);
                    this.listOfMdfs.splice(index, 1);
                } else {
                    this.toastr.error("Unable to Delete Mdf Form");
                }
            });
        } else {
            mdf.mdfRemoved = true;
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
        this.ctrl.getMdfList(this.searchTerm, this.sortValue);
    }
}