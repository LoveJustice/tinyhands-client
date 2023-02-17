/* global angular */

export default class AuditListController {
    constructor(AuditService, SessionService, SpinnerOverlayService, StickyHeader, $state, $stateParams, $uibModal, $timeout,  toastr, constants) {
        'ngInject';
        this.service = AuditService;
        this.session = SessionService;
        this.stateParams = $stateParams;
        this.modal = $uibModal;
        this.sticky = StickyHeader;
        this.spinnerOverlayService = SpinnerOverlayService;
        this.state = $state;
        this.timeout = $timeout;
        this.toastr = toastr;
        this.constants = constants;
        this.countries = [];
        this.countryId = null;
        this.formTypes = [];
        this.formTypeId = null;
        this.digits1Format = {'minimumFractionDigits': 1, 'maximumFractionDigits': 1};

        this.nextPage = "";
        this.queryParameters = {
            "page_size": 20,
            "reverse": true,
            "ordering": 'end_date',
            "search": '',
        };
        
        this.paginate = {
            items:0,
            pageSize:this.queryParameters.page_size,
            currentPage:1,
        };
        
        this.stickyOptions = this.sticky.stickyOptions;
        this.stickyOptions.zIndex = 1;

        this.getUserCountries();
        this.getFormTypes();
        this.getAuditList();
    }

    get hasAddPermission() {
        return this.session.checkPermission('AUDIT','ADD',null, null) === true;
    }

    transform(queryParameters, pageNumber) {
        var queryParams = angular.copy(queryParameters);
        if (queryParams.reverse) {
            queryParams.ordering = '-' + queryParams.ordering;
        }
        queryParams.page = pageNumber;
        var params = [];
        Object.keys(queryParams).forEach(name => {
            if (queryParams[name] !== null && queryParams[name] !== '') {
                params.push({ name: name, value: queryParams[name] });
            }
        });
        if (this.countryId !== null && this.countryId !== '') {
            params.push({"name": "country", "value": parseInt(this.countryId)});
        }
        if (this.formTypeId !== null && this.formTypeId !== '') {
            params.push({"name": "form_type", "value": parseInt(this.formTypeId)});
        }
        
        return params;
    }

    getSortIcon(column, reverse) {
        if(reverse === 'reverse'){
            return (column === this.queryParameters.ordering) && this.queryParameters.reverse;
        }
        return (column === this.queryParameters.ordering) && !this.queryParameters.reverse;
    }

    updateSort(column) {
        if (column === this.queryParameters.ordering) {
            this.queryParameters.reverse = ! this.queryParameters.reverse;
        }
        this.queryParameters.ordering = column;
        this.getVdfList();
    }
    
    getUserCountries() {
        this.service.getUserCountries(this.session.user.id).then((promise) => {
            this.countries = promise.data;
            this.countryDropDown.options = [];
            for (var idx=0; idx < this.countries.length; idx++) {
                this.countryDropDown.options.push({id: this.countries[idx].id, label: this.countries[idx].name});
            }
            this.getUserStationsForAdd();
            
            if (this.queryParameters.country_ids.length > 0) {
                let country_array = this.queryParameters.country_ids.split(',');
                for (let idx=0; idx < country_array.length; idx++) {
                    let country_id = Number(country_array[idx]);
                    for (let idx1=0; idx1 < this.countries.length; idx1++) {
                        if (this.countries[idx1].id === country_id) {
                            this.countryDropDown.selectedOptions.push(this.countryDropDown.options[idx1]);
                        }
                    }
                    
                }
            }
        });
    }
    
    getFormTypes() {
        this.service.getFormTypes().then ((promise) => {
            let formTypes = [];
            for (let idx=0; idx < promise.data.results.length; idx++) {
                if (promise.data.results[idx].name === 'IRF' || promise.data.results[idx].name === 'CIF' || promise.data.results[idx].name === 'VDF' || promise.data.results[idx].name === 'PVF' || promise.data.results[idx].name === 'SF' || promise.data.results[idx].name === 'LF') {
                    formTypes.push(promise.data.results[idx]);
                }
            }
            this.formTypes = formTypes;
        });
    }
    
    getAuditList() {
        this.showPage(1);
    }
    showPage(pageNumber) {
        this.spinnerOverlayService.show("Searching for Audits...");        
        this.service.getAuditList(this.transform(this.queryParameters, pageNumber)).then( (promise) => {
            this.audits = promise.data.results;
            this.paginate.items = promise.data.count;
            this.paginate.currentPage = pageNumber;
            this.spinnerOverlayService.hide();   
            for (let idx=0; idx < this.audits.length; idx++) {
                this.audits[idx].samplesUrl = this.state.href('auditSampleList', {
                    auditId: this.audits[idx].id,
                });
                let questions = 0;
                for (let idx2=0; idx2 < this.audits[idx].template.length; idx2++) {
                    if (this.audits[idx].template[idx2].questions) {
                        questions += this.audits[idx].template[idx2].questions;
                    }
                }
                this.audits[idx].question_count = questions;
            }
        });
    }
    
    getAuditUrl(audit, isViewing) {
        let theId = null;
        if (audit !== null) {
            theId = audit.id;
        }
        let ref =  this.state.href('audit', {
            auditId: theId,
            isViewing:isViewing,
        });
        return ref;
    }
    
    percentComplete(audit) {
        let result = '-';
        if (audit.total_samples && audit.total_samples > 0) {
            result = Math.round(audit.samples_complete * 100 /audit.total_samples);
        }
        return result;
    }
    
    accuracy(audit) {
        let result = '-';
        let total_questions = audit.question_count * audit.samples_complete;
        if (total_questions > 0) {
            result = Math.floor((total_questions - audit.total_incorrect) * 1000 / total_questions)/10;
        }
        return result;
    }
    
    passRate(audit) {
        let result = '-';
        if (audit.samples_complete > 0) {
            result = Math.floor(audit.samples_passed * 1000 / audit.samples_complete)/10;
        }
        return result;
    }
    
    result(audit) {
        let result = '';
        if (audit.samples_complete >= audit.total_samples) {
            let percent_passed = audit.samples_passed * 100 / audit.samples_complete;
            let total_questions = audit.question_count * audit.samples_complete;
            let accuracy = (total_questions - audit.total_incorrect) * 100 / total_questions;
            if (percent_passed >= 95 && accuracy >= 98) {
                result = 'Passed';
            } else {
                result = 'Failed';
            }
        }
        return result;
    }
}
