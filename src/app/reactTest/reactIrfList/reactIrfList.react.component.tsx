import * as React from 'react';

// Steps I used:
// Make a class-based react component
// Copy the AngularJS constructor in as the react component's constructor
// All of the this.xxx = ZZZ that come from angular dependencies get commented out
// All usages of the above angular dependencies change from this.xxx to this.props.ZZZ (except this.state = $state)
//  (simple find and replace on each statement in constructor)
// All of the other this.yyy = [] for initialization of state become this.state.yyy = []
// All expressions using the above variables become this.state.yyy as well
// Copy over the functions of the class, calls to this.aMethodOfTheClass() does NOT change, but code inside does

type ReactIrfListProps = {
    // Props from parent

    // AngularJS Injections
    IrfNewListService: any
    SessionService: any
    $stateParams: any
    $uibModal: any
    StickyHeader: any
    SpinnerOverlayService: any
    $state: any
    $timeout: any
    toastr: any
    constants: any
    moment: any
};

// Should really be typed like so:
// {
// countries: any[],
// stationsForAdd: any[],
// ...
// }
type ReactIrfListState = any;

class ReactIrfList extends React.Component<ReactIrfListProps, ReactIrfListState> {
    constructor(props: ReactIrfListProps) {
        super(props);

        this.state = {}
        this.state.countries = [];
        this.state.stationsForAdd = [];

        this.state.timer = {};
        this.state.searchTimer = null;
        this.state.irfs = [];
        this.state.nextPage = '';
        this.state.timeZoneDifference = '+0545';
        this.state.queryParameters = {
            page_size: 20,
            reverse: true,
            ordering: 'date_of_interception,time_of_interception',
            search: '',
            status: '!invalid',
            country_ids: '',
        };

        this.state.paginate = {
            items: 0,
            pageSize: this.state.queryParameters.page_size,
            currentPage: 1,
        };

        this.state.stickyOptions = this.state.sticky.stickyOptions;
        this.state.stickyOptions.zIndex = 1;

        this.state.countryDropDown = {};
        this.state.countryDropDown.options = [];
        this.state.countryDropDown.selectedOptions = [];
        this.state.countryDropDown.settings = {
            smartButtonMaxItems: 2,
            showCheckAll: false,
            showUncheckAll: false,
        };
        this.state.countryDropDown.customText = {buttonDefaultText: 'All'};
        this.state.countryDropDown.eventListener = {
            onItemSelect: this.state.countryChange,
            onItemDeselect: this.state.countryChange,
            onSelectAll: this.state.countryChange,
            onDeselectAll: this.state.countryChange,
            ctrl: this,
        };
        this.state.queryParameters.date_filter = 'None';
        this.state.date_end = new Date();
        this.state.date_start = new Date();
        this.state.date_start.setUTCDate(1);
        this.state.may_be_verified_by_account = false;

        this.state.oldIndex = 3;
        this.state.status = {};
        this.state.status.options = [{id: '!invalid', label: 'all valid', group: 'z'},
            {id: 'in-progress', label: 'in-progress', group: 'Status'},
            {id: 'approved,!None', label: 'submitted', group: 'Status'},
            {id: 'first-verification', label: 'first-verification', group: 'Status'},
            {id: 'second-verification', label: 'second-verification', group: 'Status'},
            {id: 'verification-tie', label: 'verification-tie', group: 'Status'},
            {id: 'verified', label: 'verified', group: 'Status'},
            {
                id: 'second-verification|verified,Evidence',
                label: 'evidence',
                group: 'Final Verification Evidence Category'
            },
            {
                id: 'second-verification|verified,High',
                label: 'high risk',
                group: 'Final Verification Evidence Category'
            },
            {id: 'invalid', label: 'invalid', group: 'Final Verification Evidence Category'}];
        this.state.status.selectedOptions = [this.state.status.options[0]];
        this.state.status.settings = {
            smartButtonMaxItems: 1,
            showCheckAll: false,
            showUncheckAll: false,
            selectionLimit: 1,
            groupByTextProvider(groupValue) {
                if (groupValue === 'z') {
                    return '';
                } else {
                    return groupValue;
                }
            },
            groupBy: 'group',
            closeOnSelect: true,
        };
        this.state.status.customText = {};
        this.state.status.eventListener = {
            onItemSelect: this.state.statusChange,
            onItemDeselect: this.state.ange,
            ctrl: this,
        };

        // If there was a search value provided in the url, set it
        let foundStateParams = false;
        if (props.$stateParams) {
            if (props.$stateParams.search) {
                foundStateParams = true;
                this.state.queryParameters.search = props.$stateParams.search;
            }
            if (props.$stateParams.country_ids) {
                foundStateParams = true;
                this.state.queryParameters.country_ids = props.$stateParams.country_ids;
            }
            if (props.$stateParams.status) {
                foundStateParams = true;
                this.state.queryParameters.status = props.$stateParams.status;
            }
        }

        if (!foundStateParams) {
            let tmp = sessionStorage.getItem('irfList-search');
            if (tmp !== null) {
                this.state.queryParameters.search = tmp;
            }
            tmp = sessionStorage.getItem('irfList-status');
            if (tmp !== null) {
                this.state.queryParameters.status = tmp;
            }
            tmp = sessionStorage.getItem('irfList-country_ids');
            if (tmp !== null) {
                this.state.queryParameters.country_ids = tmp;
            }
        }

        let tmp = sessionStorage.getItem('irfList-date_filter');
        if (tmp !== null) {
            this.state.queryParameters.date_filter = tmp;
        }
        tmp = sessionStorage.getItem('irfList-date_start');
        if (tmp !== null) {
            this.state.date_start = new Date(tmp);
        }
        tmp = sessionStorage.getItem('irfList-date_end');
        if (tmp !== null) {
            this.state.date_end = new Date(tmp);
        }

        sessionStorage.setItem('irfList-date_filter', this.state.queryParameters.date_filter);
        sessionStorage.setItem('irfList-date_start', this.state.date_start);
        sessionStorage.setItem('irfList-date_end', this.state.date_end);

        if (this.state.queryParameters.status !== '') {
            this.state.status.selectedOptions = [];
            for (let optionIdx in this.state.status.options) {
                if (this.state.queryParameters.status === this.state.status.options[optionIdx].id) {
                    this.state.status.selectedOptions.push(this.state.status.options[optionIdx]);
                    break;
                }
            }
        }

    }

    // Not sure if these are supposed to be in the constructor or not
    componentDidMount() {
        this.getUserCountries();
        this.searchIrfs();

        this.getUserStationsForAdd();
    }

    getUserCountries() {
        let keepOldList = ['Nepal', 'Bangladesh', 'India'];
        let keepOld = false;
        this.props.IrfNewListService.getUserCountries(this.props.SessionService.user.id).then(promise => {
            this.state.countries = promise.data;
            this.state.countryDropDown.options = [];
            for (var idx = 0; idx < this.state.countries.length; idx++) {
                this.state.countryDropDown.options.push({
                    id: this.state.countries[idx].id,
                    label: this.state.countries[idx].name,
                });
                if (keepOldList.indexOf(this.state.countries[idx].name) > -1) {
                    keepOld = true;
                }
            }
            this.getUserStationsForAdd();

            if (this.state.queryParameters.country_ids.length > 0) {
                let country_array = this.state.queryParameters.country_ids.split(',');
                for (let idx = 0; idx < country_array.length; idx++) {
                    let country_id = Number(country_array[idx]);
                    for (let idx1 = 0; idx1 < this.state.countries.length; idx1++) {
                        if (this.state.countries[idx1].id === country_id) {
                            this.state.countryDropDown.selectedOptions.push(this.state.countryDropDown.options[idx1]);
                        }
                    }
                }
            }

            if (!keepOld && this.state.status.options[this.state.oldIndex].label.startsWith('old')) {
                this.state.status.options.splice(this.state.oldIndex, 1);
            }

        });
    }

    searchIrfs() {
        if (this.state.timer.hasOwnProperty('$$timeoutId')) {
            this.props.$timeout.cancel(this.state.timer);
        }

        sessionStorage.setItem('irfList-search', this.state.queryParameters.search);
        sessionStorage.setItem('irfList-status', this.state.queryParameters.status);
        sessionStorage.setItem('irfList-country_ids', this.state.queryParameters.country_ids);
        sessionStorage.setItem('irfList-date_filter', this.state.queryParameters.date_filter);
        sessionStorage.setItem('irfList-date_start', this.state.date_start);
        sessionStorage.setItem('irfList-date_end', this.state.date_end);

        this.state.queryParameters.date_start = this.dateAsString(this.state.date_start);
        this.state.queryParameters.date_end = this.dateAsString(this.state.date_end);
        this.state.timer = this.props.$timeout(() => {
            this.state.go('.', {
                search: this.state.queryParameters.search,
                status: this.state.queryParameters.status,
                country_ids: this.state.queryParameters.country_ids,
            });
            this.getIrfList();
        }, 500);
    }

    getUserStationsForAdd() {
        this.props.IrfNewListService.getUserStationsForAdd(this.props.SessionService.user.id).then(promise => {
            this.state.stationsForAdd = promise.data;
            for (let idx = 0; idx < this.state.stationsForAdd.length; idx++) {
                for (let idx2 = 0; idx2 < this.state.countries.length; idx2++) {
                    if (this.state.stationsForAdd[idx].operating_country === this.state.countries[idx2].id) {
                        this.state.stationsForAdd[idx].country_name = this.state.countries[idx2].name;
                        this.state.stationsForAdd[idx].country_id = this.state.countries[idx2].id;
                    }
                }
            }
        });
    }

    dateAsString(inDate) {
        let dateString = '';
        dateString = inDate.getUTCFullYear() + '-';
        if (inDate.getUTCMonth() < 9) {
            dateString += '0';
        }
        dateString += (inDate.getUTCMonth() + 1) + "-";
        if (inDate.getUTCDate() <= 9) {
            dateString += '0';
        }
        dateString += inDate.getUTCDate();
        return dateString;
    }

    getIrfList() {
        this.showPage(1);
    }

    showPage(pageNumber) {
        this.props.SpinnerOverlayService.show("Searching for IRFs...");
        this.props.IrfNewListService.getIrfList(this.transform(this.state.queryParameters, pageNumber)).then((promise) => {
            this.state.irfs = promise.data.results;
            this.state.paginate.items = promise.data.count;
            this.state.paginate.currentPage = pageNumber;
            this.props.SpinnerOverlayService.hide();
            this.addUrls(this.state.irfs);
        });
    }

    transform(queryParameters, pageNumber) {
        var queryParams = angular.copy(queryParameters);
        if (queryParams.reverse) {
            let parts = queryParams.ordering.split(',');
            queryParams.ordering = "";
            for (let idx = 0; idx < parts.length; idx++) {
                if (queryParams.ordering.length > 0) {
                    queryParams.ordering += ',';
                }
                queryParams.ordering += '-' + parts[idx];
            }
        }
        queryParams.page = pageNumber;
        delete queryParams.reverse;
        var params = [];
        Object.keys(queryParams).forEach(name => {
            if (queryParams[name] !== null && queryParams[name] !== '') {
                params.push({name: name, value: queryParams[name]});
            }
        });
        return params;
    }

    addUrls(irfs) {
        for (let idx = 0; idx < irfs.length; idx++) {
            let irf = irfs[idx];
            if (irf.form_name !== null) {
                irf.viewUrl = this.state.href(irfs[idx].form_name, {
                    id: irf.id,
                    stationId: irf.station.id,
                    countryId: irf.station.operating_country.id,
                    isViewing: true,
                    formName: irfs[idx].form_name,
                });
                irf.editUrl = this.state.href(irfs[idx].form_name, {
                    id: irf.id,
                    stationId: irf.station.id,
                    countryId: irf.station.operating_country.id,
                    isViewing: false,
                    formName: irfs[idx].form_name,
                });
            }
            irf.relatedUrl = this.state.href('relatedForms', {
                stationId: irf.station.id,
                formNumber: irf.irf_number
            });
        }
    }

    render() {
        // let exportAttachmentsButton = <button className="btn btn-primary"
        //                                       ng-if="irfNewListCtrl.session.checkPermission('IRF','VIEW PI',null, null)"
        //                                       ng-click="irfNewListCtrl.attachmentExport()">Export Attachments
        // </button>;
        let photoexport = <photoexportComponent
            ng-if="irfNewListCtrl.session.checkPermission('IRF','VIEW PI',null, null)"></photoexportComponent>;
        // let createIrfButton = <a ng-if="irfNewListCtrl.hasAddPermission" className="btn btn-success"
        //                          ng-click="irfNewListCtrl.createIrf()">
        //     Input A New IRF
        // </a>;
        // let countryMultiSelect = <div ng-dropdown-multiselect="" options="irfNewListCtrl.countryDropDown.options"
        //                               selected-model="irfNewListCtrl.countryDropDown.selectedOptions"
        //                               extra-settings="irfNewListCtrl.countryDropDown.settings"
        //                               translation-texts="irfNewListCtrl.countryDropDown.customText"
        //                               events="irfNewListCtrl.countryDropDown.eventListener">
        // </div>;
        // let dateTypeSelect = <select ng-model="irfNewListCtrl.queryParameters.date_filter" className="form-control"
        //                              ng-change="irfNewListCtrl.searchIrfs()">
        //     <option value="None">None</option>
        //     <option value="First Verification">First Verification</option>
        //     <option value="Second Verification">Second Verification/Verified</option>
        //     <option value="Interception">Interception</option>
        // </select>;
        // let fromDateInput = <input type="date" className="form-control" ng-model-options="{timezone: 'utc'}"
        //                            ng-model="irfNewListCtrl.date_start" ng-change="irfNewListCtrl.searchIrfs()"/>;
        // let toDateInput = <input type="date" className="form-control" ng-model-options="{timezone: 'utc'}"
        //                          ng-model="irfNewListCtrl.date_end" ng-change="irfNewListCtrl.searchIrfs()"/>;
        // let searchStringInput = <input ng-change="irfNewListCtrl.searchIrfs()"
        //                                ng-model="irfNewListCtrl.queryParameters.search" placeholder="Search"
        //                                className="form-control" autoFocus/>;
        // let statusOptionsMultiSelect = <div style="width:180px" ng-dropdown-multiselect=""
        //                                     options="irfNewListCtrl.status.options"
        //                                     ng-show="irfNewListCtrl.filterType!='Filter by Second-Verification Evidence'"
        //                                     options="irfNewListCtrl.status.options"
        //                                     ng-show="irfNewListCtrl.filterType=='Filter by IRF status'"
        //                                     selected-model="irfNewListCtrl.status.selectedOptions"
        //                                     extra-settings="irfNewListCtrl.status.settings"
        //                                     translation-texts="irfNewListCtrl.status.customText"
        //                                     events="irfNewListCtrl.status.eventListener" className="pull-right">
        // </div>;
        // let table = <table className="table table-striped" float-thead="irfNewListCtrl.stickyOptions"
        //                    ng-model="irfNewListCtrl.irfs">
        //     <thead className="sticky-table-header">
        //     <tr>
        //         <th ng-click="irfNewListCtrl.updateSort('irf_number')" width="8%">IRF #
        //             <i ng-class="{ 'glyphicon glyphicon-sort-by-alphabet': irfNewListCtrl.getSortIcon('irf_number', '!reverse'),
        //         'glyphicon glyphicon-sort-by-alphabet-alt': irfNewListCtrl.getSortIcon('irf_number', 'reverse') }"></i>
        //         </th>
        //         <th width="8%">Status</th>
        //         <th ng-click="irfNewListCtrl.updateSort('staff_name')" width="15%">Staff Name
        //             <i ng-class="{ 'glyphicon glyphicon-sort-by-alphabet': irfNewListCtrl.getSortIcon('staff_name', '!reverse'),
        //         'glyphicon glyphicon-sort-by-alphabet-alt': irfNewListCtrl.getSortIcon('staff_name', 'reverse')}"></i>
        //         </th>
        //         <th ng-click="irfNewListCtrl.updateSort('number_of_victims')" width="10%"># of Potential Victims
        //             <i ng-class="{ 'glyphicon glyphicon-sort-by-alphabet': irfNewListCtrl.getSortIcon('number_of_victims', '!reverse'),
        //         'glyphicon glyphicon-sort-by-alphabet-alt': irfNewListCtrl.getSortIcon('number_of_victims', 'reverse')}"></i>
        //         </th>
        //         <th ng-click="irfNewListCtrl.updateSort('number_of_traffickers')" width="10%"># of Suspects
        //             <i ng-class="{ 'glyphicon glyphicon-sort-by-alphabet': irfNewListCtrl.getSortIcon('number_of_traffickers', '!reverse'),
        //         'glyphicon glyphicon-sort-by-alphabet-alt': irfNewListCtrl.getSortIcon('number_of_traffickers', 'reverse')}"></i>
        //         </th>
        //         <th ng-click="irfNewListCtrl.updateSort('date_of_interception,time_of_interception')"
        //             width="16%">Time of Interception
        //             <i ng-class="{ 'glyphicon glyphicon-sort-by-alphabet': irfNewListCtrl.getSortIcon('date_of_interception,time_of_interception', '!reverse'),
        //         'glyphicon glyphicon-sort-by-alphabet-alt': irfNewListCtrl.getSortIcon('date_of_interception,time_of_interception', 'reverse')}"></i>
        //         </th>
        //         <th ng-click="irfNewListCtrl.updateSort('verified_date')" width="16%"
        //             className="hidden-xs">Verification Date
        //             <i ng-class="{ 'glyphicon glyphicon-sort-by-alphabet': irfNewListCtrl.getSortIcon('verified_date', '!reverse'),
        //         'glyphicon glyphicon-sort-by-alphabet-alt': irfNewListCtrl.getSortIcon('verified_date', 'reverse')}"></i>
        //         </th>
        //         <th ng-click="irfNewListCtrl.updateSort('date_time_last_updated')" width="16%"
        //             className="hidden-xs">Time Last Edited
        //             <i ng-class="{ 'glyphicon glyphicon-sort-by-alphabet': irfNewListCtrl.getSortIcon('date_time_last_updated', '!reverse'),
        //         'glyphicon glyphicon-sort-by-alphabet-alt': irfNewListCtrl.getSortIcon('date_time_last_updated', 'reverse')}"></i>
        //         </th>
        //         <th></th>
        //         <th></th>
        //         <th></th>
        //     </tr>
        //     </thead>
        //     <tbody>
        //     <tr ng-repeat="irf in irfNewListCtrl.irfs | orderBy:this.queryParameters.ordering:this.queryParameters.reverse">
        //         <td>{{irf.irf_number}}</td>
        //         <td>{{irf.status}}</td>
        //         <td>{{irf.staff_name}}</td>
        //         <td>{{irf.number_of_victims | number}}</td>
        //         <td>{{irf.number_of_traffickers | number}}</td>
        //         <td>{{irf.date_time_of_interception | date:"medium" : irfNewListCtrl.timeZoneDifference}}</td>
        //         <td className="hidden-xs">{{irf.verified_date}}</td>
        //         <td className="hidden-xs">{{
        //             irf
        //             .date_time_last_updated | date:"medium" : irfNewListCtrl.timeZoneDifference}}</td>
        //         <td ng-if="irfNewListCtrl.session.checkPermission('IRF','VIEW',irf.station.operating_country.id, irf.station.id)">
        //             <a className="btn btn-sm btn-primary" ng-href="{{irf.viewUrl}}">View</a></td>
        //         <td ng-if="irfNewListCtrl.session.checkPermission('IRF','EDIT',irf.station.operating_country.id, irf.station.id)">
        //             <a className="btn btn-sm btn-primary" ng-href="{{irf.editUrl}}">Edit</a></td>
        //         <td ng-if="irfNewListCtrl.session.checkPermission('IRF','DELETE',irf.station.operating_country.id, irf.station.id) && irf.status !== 'second-verification' && irf.status !== 'old' && irf.status !== 'verified'">
        //             <a className="btn btn-sm btn-danger" ng-click="irfNewListCtrl.deleteIrf(irf, $index)">
        //                 {{irf.confirmedDelete ? "Confirm?" : "Delete"}}</a></td>
        //     </tr>
        //     <tr ng-show="irfNewListCtrl.irfs.length == 0">
        //         <td colSpan="12" style="text-align:center;"><h2>No IRFs Matched your search for: "{{
        //             irfNewListCtrl
        //             .queryParameters.search
        //         }}"</h2></td>
        //     </tr>
        //     </tbody>
        // </table>;
        // let paginate = <paginate page-control="irfNewListCtrl.paginate" controller="irfNewListCtrl"/>;
        // let mayBeVerifiedCheckbox = <input type="checkbox" className="form-control"
        //                                    ng-model="irfNewListCtrl.may_be_verified_by_account"
        //                                    ng-change="irfNewListCtrl.searchTimerExpired()"/>;
        return (
            <div className="container" id="irfNewList"><br/>
                <div className="row">
                    <div className="col-xs-7">
                        <h1>Interception Record Forms (IRFs)</h1>
                    </div>

                    <div className="pull-right"><br/>
                        {/*{exportAttachmentsButton}*/}
                        {photoexport}
                        {/*{createIrfButton}*/}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3">
                        <p>Countries</p>
                        {/*{countryMultiSelect}*/}
                    </div>
                    <!-- End dropdown -->
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-4">Filter by Date</div>
                            <div className="col-md-4">
                                {/*{dateTypeSelect}*/}
                            </div>
                        </div>
                        <div className="row center-vertical"
                             ng-show="irfNewListCtrl.queryParameters.date_filter!='None'">
                            <div className="col-md-1 center-vertical">
                                <p>From:</p>
                            </div>
                            <div className="col-md-4">
                                {/*{fromDateInput}*/}
                            </div>
                            <div className="col-md-1 center-vertical">
                                <p>To:</p>
                            </div>
                            <div className="col-md-4">
                                {/*{toDateInput}*/}
                            </div>
                        </div>
                    </div>

                    <!-- Search -->
                    <div className="col-md-3 search-bar pull-right">
                        <form>
                            <label className="pull-right">
                                {/*{searchStringInput}*/}
                            </label>
                        </form>

                        {/*{statusOptionsMultiSelect}*/}

                    </div>
                    <!-- End search -->

                </div>
                <div className="row"
                     ng-if="irfNewListCtrl.status.selectedOptions[0].label === 'submitted' || irfNewListCtrl.status.selectedOptions[0].label==='verification-tie'">
                    <div className="col-md-3 search-bar pull-right">
                        <div className="row center-vertical">
                            <div className="col-md-2">
                                {/*{mayBeVerifiedCheckbox}*/}
                            </div>
                            <div className="col-md-10">May be verified by me</div>
                        </div>
                    </div>
                </div>
                <br/>
                {/*{table}*/}

                <div className="row text-center">
                    {/*{paginate}*/}
                </div>
                <br/>
            </div>

        );
    }
}

export default ReactIrfList;