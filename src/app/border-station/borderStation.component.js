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
    constructor($scope, $state, $stateParams, $timeout, $uibModal, BorderStationService, SessionService, toastr) {
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
        this.isViewing = false;
        
        this.stepTemplates = [
            {template:detailTemplate, name:"Details"},
            {template:committeeTemplate, name:"Subcommittee"},
            {template:staffTemplate, name:"Staff"},
            {template:locationTemplate, name:"Locations"},
            {template:formsTemplate, name:"Forms"},
        ];
        
        this.setForms = this.session.checkPermission('STATIONS','SET_FORMS',null, null);
        
        this.timeZoneOptions = [];
        this.countryOptions = [];
        this.formTypes = [];
        this.formOptions = {};
        this.formSelected = {};
        this.borderStationPresent = false;
        this.availableFormsPresent = false;
        this.loading = false;
        
        this.getAllCountries();
        this.getAllTimeZones();
        this.getBorderStation($stateParams.id);
        this.getFormTypes();
    }
    
    getBorderStation(id) {
        this.service.getFormConfig('borderStation').then ((response) => {
            this.config = response.data;
            this.service.getBorderStation(id).then((response) => {
                this.processResponse(response, id);
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
    
    getAllCountries() {
        this.service.getAllCountries().then((response) => {
            if (this.$stateParams.id !== null) {
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
        for (let idx=0; idx < this.questions[964].response.value.length; idx++) {
            let formId = this.questions[964].response.value[idx];
            for (let property in this.formOptions) {
                for (let idx2=0; idx2 < this.formOptions[property].length; idx2++) {
                    let optionFormId = this.formOptions[property][idx2].id;
                    if (optionFormId === formId) {
                        this.formSelected[property] = optionFormId;
                    }
                }
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
                cards.splice(cardIndex, 1);
                this.redFlagTotal = this.redFlagTotal - starting_flag_count;
            } else {
                this.redFlagTotal = this.redFlagTotal + the_card.flag_count - starting_flag_count;
                if (isAdd) {
                    cards.push(the_card);
                }
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
        this.service.submitBorderStation(this.stateParams.id, this.response).then((response) => {
             this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.session.getUserPermissions();  // Refreshes border station list in navbar
             this.$state.go('dashboard');
         }, (error) => {
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