import {BaseFormController} from '../baseFormController.js';
import {BaseModalController} from '../baseModalController.js';
import StationModalController from './stationModal.controller';
import './borderStation.less';

import detailTemplate from './step-templates/detail.html';
import committeeTemplate from './step-templates/committee/committee.html';
import staffTemplate from './step-templates/staff/staff.html';
import locationTemplate from './step-templates/location/location.html';
import formsTemplate from './step-templates/forms.html';
import committeeModalTemplate from './step-templates/committee/committeeModal.html';
import staffModalTemplate from './step-templates/staff/staffModal.html';
import locationModalTemplate from './step-templates/location/locationModal.html';

import templateUrl from './borderStation.html';

class BorderStationController extends BaseFormController  { 
    constructor($scope, $state, $stateParams, $timeout, $uibModal, BorderStationService, SessionService, toastr, SpinnerOverlayService) {
        'ngInject';
        super($scope, $stateParams);
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.service = BorderStationService;
        this.session = SessionService;
        this.toastr = toastr;
        this.spinner = SpinnerOverlayService;
        this.isViewing = false;
        this.stationId = $stateParams.id;
        
        this.stepTemplates = [
            {template:detailTemplate, name:"Details"},
            {template:committeeTemplate, name:"Subcommittee"},
            {template:staffTemplate, name:"Staff"},
            {template:locationTemplate, name:"Locations"},
            {template:formsTemplate, name:"Forms"},
        ];
        
        this.setForms = this.session.checkPermission('STATIONS','SET_FORMS',null, null);
        
        this.detailsQuestions = [948,949,950,951,953,954,955,956,972];
        this.originalDetailValues = {};
        
        this.timeZoneOptions = [];
        this.countryOptions = [];
        this.formTypes = [];
        this.formOptions = {};
        this.formSelected = {};
        this.formSelectedOriginal = {};
        this.borderStationPresent = false;
        this.availableFormsPresent = false;
        this.loading = false;
        
        this.getAllCountries();
        this.getAllTimeZones();
        this.getBorderStation($stateParams.id);
        this.getFormTypes();
    }
    
    changeTab(tabIndex) {
        if (this.selectedStep === 0 && !this.response.storage_id && this.response.storage_id !== 0) {
            this.toastr.error('Details must be entered and saved before switching to a new tab');
            return;
        }
        if (this.selectedStep === 0 && this.haveDetailValuesChanged()) {
            if (window.confirm("Details information has been changed.\nSelect Ok to save changes.\nSelect Cancel to discard changes.")) {
                this.submit();
            } else {
                this.restoreDetailValues();
            }
        }
        
        if (this.selectedStep === 4 && this.haveFormsChanged()) {
            if (window.confirm("Forms information has been changed.\nSelect Ok to save changes.\nSelect Cancel to discard changes.")) {
                this.submit();
            } else {
                this.restoreForms();
            }
        }
        this.selectedStep = tabIndex;
    }
    
    getBorderStation(id) {
        this.service.getFormConfig('borderStation').then ((response) => {
            this.config = response.data;
            this.service.getBorderStation(id).then((response) => {
                this.processResponse(response);
                this.saveDetailValues();
                if (id && !this.session.checkPermission('STATIONS','EDIT',this.questions[955].response.value, null)) {
                    this.isViewing = true;
                }
                this.borderStationPresent = true;
                if (this.availableFormsPresent) {
                    this.getCurrentForms();
                }
            });
        });
    }
    
    saveDetailValues() {
        for (let idx=0; idx < this.detailsQuestions.length; idx++) {
            let question = this.detailsQuestions[idx];
            this.originalDetailValues[question] = this.questions[question].response.value;
        }
    }
    
    haveDetailValuesChanged() {
        for (let idx=0; idx < this.detailsQuestions.length; idx++) {
            let question = this.detailsQuestions[idx];
            if (this.originalDetailValues[question] != this.questions[question].response.value) {
                return true
            }
        }
        return false;
    }
    
    restoreDetailValues() {
        for (let idx=0; idx < this.detailsQuestions.length; idx++) {
            let question = this.detailsQuestions[idx];
            this.questions[question].response.value = this.originalDetailValues[question];
        }
    }
    
    getAllCountries() {
        this.service.getAllCountries().then((response) => {
            if (this.stationId !== null) {
                this.countryOptions = response.data.results;
            } else{
                var tmpCountry = response.data.results;
                this.countryOptions = [];
                for (var idx=0; idx < tmpCountry.length; idx++) {
                    if (this.session.checkPermission('STATIONS','ADD',tmpCountry[idx].id, null)) {
                        this.countryOptions.push(tmpCountry[idx]);
                    }
                }
            }
        });
      }
    
    getAllTimeZones() {
        this.service.getAllTimeZones().then((response) => {
            this.timeZoneOptions = response.data;
        });
    }
    
    getFormTypes() {
        this.service.getFormTypes().then(response => {
            this.formTypes = response.data.results;
            for (let idx = 0; idx < this.formTypes.length; idx++) {
                this.formOptions[this.formTypes[idx].name] = [];
            }
            this.getAvailableForms();
        });
    }

    getAvailableForms() {
        this.service.getAvailableForms().then(response => {
            let avail = response.data;
            for (let idx = 0; idx < avail.length; idx++) {
                this.formOptions[avail[idx].form_type.name].push(avail[idx]);
            }
            this.availableFormsPresent = true;
            if (this.borderStationPresent) {
                this.getCurrentForms();
            }
        });
    }

    getCurrentForms() {
        this.formSelected = {};
        this.formSelectedOriginal = {};
        for (let idx=0; idx < this.questions[964].response.value.length; idx++) {
            let formId = this.questions[964].response.value[idx];
            for (let property in this.formOptions) {
                for (let idx2=0; idx2 < this.formOptions[property].length; idx2++) {
                    let optionFormId = this.formOptions[property][idx2].id;
                    if (optionFormId === formId) {
                        this.formSelected[property] = optionFormId;
                        this.formSelectedOriginal[property] = optionFormId;
                    }
                }
            }
        }
    }
    
    haveFormsChanged() {
        for (let property in this.formOptions) {
            if (property in this.formSelected) {
                if (property in this.formSelectedOriginal && this.formSelected[property] === this.formSelectedOriginal[property]) {
                    // matching values
                } else {
                    return true;
                }
            } else if (property in this.formSelectedOriginal) {
                return true;
            }
        }
        
        return false;
    }
    
    restoreForms() {
        this.formSelected = {}
        for (let property in this.formOptions) {
            if (property in this.formSelectedOriginal) {
                this.formSelected[property] = this.formSelectedOriginal[property];
            }
        }
        
    }
    
    changeStationStatus() {
        this.questions[948].response.value = !this.questions[948].response.value;
    }
    
    openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name) {
        let config = this.config[config_name];      
        let starting_flag_count = the_card.flag_count;
        this.modalActions = [];
        this.$uibModal.open({
            bindToController: true,
            controller: theController,
            controllerAs: theControllerName,
            resolve: {
                isAdd: () => isAdd,
                card: () => the_card,
                isViewing: () => this.isViewing,
                modalActions: () => this.modalActions,
                config: () => config,
            },
            size: 'lg',
            templateUrl: theTemplate,
        }).result.then(() => {
            let cards = this.getCardInstances(config_name);
            if (this.modalActions.indexOf('removeCard') > -1 && cardIndex !== null) {
                if (window.confirm("Confirm that you wish to remove this entry")) {
                    cards.splice(cardIndex, 1);
                    this.redFlagTotal = this.redFlagTotal - starting_flag_count;
                    this.submit();
                }
            } else {
                this.redFlagTotal = this.redFlagTotal + the_card.flag_count - starting_flag_count;
                if (isAdd) {
                    cards.push(the_card);
                }
                this.submit();
            }
        });
    }
    
    openCommitteeModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, BaseModalController, 'CommitteeModalController',
                committeeModalTemplate, 'Commitee Members');
    }
    
    openStaffModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, StationModalController, 'StaffModalController',
                staffModalTemplate, 'Staff');
    }
    
    openLocationModal(responses = [], isAdd = false, idx=null) {
        this.commonModal(responses, isAdd, idx, StationModalController, 'LocationModalController',
                locationModalTemplate, 'Location');
    }
    
    prepareForms() {
        let formList = [];
        for (let property in this.formSelected) {
            if (this.formSelected[property]) {
                formList.push(this.formSelected[property]);
            }
        }
        this.questions[964].response.value = formList;
    }
    
    submit() {
        this.errorMessages = [];
        this.warningMessages = [];
        this.prepareForms();
        this.spinner.show('Saving changes...');
        this.service.submitBorderStation(this.stationId, this.response).then((response) => {
             this.spinner.hide();
             this.processResponse(response);
             this.stationId = response.data.storage_id;
             this.saveDetailValues();
             if (this.availableFormsPresent) {
                 this.getCurrentForms();
             }
             this.session.getUserPermissions();  // Refreshes border station list in navbar
             this.toastr.success('Changes saved');
         }, (error) => {
             this.spinner.hide();
             this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
        
        this.messagesEnabled = true;
    }
}


export default {
    templateUrl,
    controller: BorderStationController,
};