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

        this.nextPage = "";
        this.queryParameters = {
            "page_size": 25,
            "reverse": true,
            "ordering": 'date_time_of_interception',
            "search": '',
            "status": 'approved',
            "country_ids": ''
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

    transform() {
        var params = [];
        if (this.countryId !== null && this.countryId !== '') {
            params.push({"name": "country", "value": parseInt(this.countryId)});
        }
        if (this.formTypeId !== null && this.formTypeId !== '') {
            params.push({"name": "form_type", "value": parseInt(this.formTypeId)});
        }
        
        return params;
    }

    extractPage(url) {
        try {
            return url.slice(url.indexOf('page=')).split('&')[0].split('=')[1];
        } catch (e) {
            return 0;
        }
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
                if (promise.data.results[idx].name === 'IRF' || promise.data.results[idx].name === 'CIF' || promise.data.results[idx].name === 'VDF') {
                    formTypes.push(promise.data.results[idx]);
                }
            }
            this.formTypes = formTypes;
        });
    }
    

    getAuditList() {
        this.spinnerOverlayService.show("Searching for Auditss...");        
        this.service.getAuditList(this.transform(this.queryParameters)).then( (promise) => {
            this.audits = promise.data.results;
            this.nextPage = this.extractPage(promise.data.next);
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

    showMoreAudits() {
        let params = angular.copy(this.queryParameters);
        params.page = this.nextPage;
        this.service.getMoreAudits(this.transform(params)).then( (promise) => {
            this.vdfs = this.vdfs.concat(promise.data.results);
            this.nextPage = this.extractPage(promise.data.next);
            this.addUrls(this.vdfs);
        });
    }
    
    percentComplete(audit) {
        let result = '-';
        if (audit.total_samples && audit.total_samples > 0) {
            result = Math.round(audit.samples_complete * 100 /audit.total_samples) + '%';
        }
        return result;
    }
    
    accuracy(audit) {
        let result = '-';
        let total_questions = audit.question_count * audit.samples_complete;
        if (total_questions > 0) {
            result = Math.round((total_questions - audit.total_incorrect) * 100 / total_questions)+'%';
        }
        return result;
    }
    
    result(audit) {
        let result = '';
        if (audit.samples_complete >= audit.total_samples) {
            let percent_passed = Math.round(audit.samples_passed * 100 / audit.samples_complete);
            if (percent_passed >= 95) {
                result = 'Passed';
            } else {
                result = 'Failed';
            }
        }
        return result;
    }
}
