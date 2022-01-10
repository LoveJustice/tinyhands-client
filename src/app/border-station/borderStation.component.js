import {BaseFormController} from '../baseFormController.js';
import {BaseModalController} from '../baseModalController.js';
import StationModalController from './stationModal.controller';
import './borderStation.less';
const CheckboxGroup = require('../checkboxGroup.js');

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
        this.checkboxGroup = new CheckboxGroup();
        this.checkboxGroupQuestion = 1081;
        this.featureList = [
            "hasStaff","hasSubcommittee","hasProjectStats",
            "hasLocations","hasLocationStaffing","hasForms"
        ];
        for (let idx=0; idx < this.featureList.length; idx++) {
            this.checkboxGroup.checkboxItem(this.checkboxGroupQuestion, this.featureList[idx]);
        }
        
        this.stepTemplates = [
            {template:detailTemplate, name:"Details"},
            {template:committeeTemplate, name:"Subcommittee"},
            {template:staffTemplate, name:"Staff"},
            {template:locationTemplate, name:"Locations"},
            {template:formsTemplate, name:"Forms"},
        ];
        
        this.setForms = this.session.checkPermission('PROJECTS','SET_FORMS',null, null);
        this.setFeatures = this.session.checkPermission('PROJECTS','SET_FEATURES',null, null);
        
        this.detailsQuestions = [948,949,950,951,953,954,955,956,1080,1081];
        this.originalDetailValues = {};
        
        this.timeZoneOptions = [];
        this.countryOptions = [];
        this.projectCategoryOptions = [];
        this.formTypes = [];
        this.formOptions = {};
        this.formSelected = {};
        this.formSelectedOriginal = {};
        this.borderStationPresent = false;
        this.availableFormsPresent = false;
        this.loading = false;
        
        this.getAllCategories();
        this.getAllCountries();
        this.getAllTimeZones();
        this.getBorderStation($stateParams.id);
        this.getFormTypes();
    }
    
    changeTab(tabIndex, isDisabled) {
        if (isDisabled) {
            return;
        }
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
    
    inactiveTab(tabName) {
        let result = false;
        if (tabName ==='Subcommittee' && !this.checkboxGroup.questions[this.checkboxGroupQuestion].hasSubcommittee) {
            result = true;
        }
        if (tabName ==='Staff' && !this.checkboxGroup.questions[this.checkboxGroupQuestion].hasStaff) {
            result = true;
        }
        if (tabName === 'Locations' && !this.checkboxGroup.questions[this.checkboxGroupQuestion].hasLocations) {
            result = true;
        }
        if (tabName === 'Forms' && !this.checkboxGroup.questions[this.checkboxGroupQuestion].hasForms) {
            result = true;
        }
        
        return result;
    }
    
    getBorderStation(id) {
        this.service.getFormConfig('borderStation').then ((response) => {
            this.config = response.data;
            this.service.getBorderStation(id).then((response) => {
                this.processResponse(response);
                this.saveDetailValues();
                if (id && !this.session.checkPermission('PROJECTS','EDIT',this.questions[955].response.value, null)) {
                    this.isViewing = true;
                }
                this.borderStationPresent = true;
                if (this.availableFormsPresent) {
                    this.getCurrentForms();
                }
                this.checkboxGroup.initOriginalValues(this.questions);
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
        this.questions[this.checkboxGroupQuestion].response.value = this.checkboxGroup.getValue(this.checkboxGroupQuestion);
        for (let idx=0; idx < this.detailsQuestions.length; idx++) {
            let question = this.detailsQuestions[idx];
            if (this.originalDetailValues[question] !== this.questions[question].response.value) {
                return true;
            }
        }
        return false;
    }
    
    restoreDetailValues() {
        for (let idx=0; idx < this.detailsQuestions.length; idx++) {
            let question = this.detailsQuestions[idx];
            this.questions[question].response.value = this.originalDetailValues[question];
        }
        this.checkboxGroup.initOriginalValues(this.questions);
    }
    
    getAllCountries() {
        this.service.getAllCountries().then((response) => {
            if (this.stationId !== null) {
                this.countryOptions = response.data.results;
            } else{
                var tmpCountry = response.data.results;
                this.countryOptions = [];
                for (var idx=0; idx < tmpCountry.length; idx++) {
                    if (this.session.checkPermission('PROJECTS','ADD',tmpCountry[idx].id, null)) {
                        this.countryOptions.push(tmpCountry[idx]);
                    }
                }
            }
        });
      }
    
    getAllCategories() {
        this.service.getAllProjectCategories().then((response) => {
            var tmpCategories = response.data;
            this.projectCategoryOptions = [];
            for (var idx=0; idx < tmpCategories.length; idx++) {
                this.projectCategoryOptions.push(tmpCategories[idx]);
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
        if (this.questions[964].response.value) {
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
        this.formSelected = {};
        for (let property in this.formOptions) {
            if (property in this.formSelectedOriginal) {
                this.formSelected[property] = this.formSelectedOriginal[property];
            }
        }
        
    }
    
    changeStationStatus() {
        this.questions[948].response.value = !this.questions[948].response.value;
    }
    
    checkFeatures(modifiedFeature) {
        let idx=0;
        let cards = this.getCardInstances('Commitee Members');
        let activeSubcommittee = cards.length > 0;
        cards = this.getCardInstances('Staff');
        let activeStaff = false;
        for (idx=0; idx < cards.length; idx++) {
            if (!this.getResponseOfQuestionById(cards[idx].responses, 970).value) {
                activeStaff = true;
                break;
            }
        }
        cards = this.getCardInstances('Location');
        let activeLocations = false;
        for (idx=0; idx < cards.length; idx++) {
            if (this.getResponseOfQuestionById(cards[idx].responses, 973).value) {
                activeLocations = true;
                break;
            }
        }
        
        let activeForms = false;
        for (idx=0; idx < this.formTypes.length; idx++) {
            if (this.formSelected[this.formTypes[idx].name]) {
                activeForms = true;
            }
        }
        
        if (activeSubcommittee && !this.checkboxGroup.questions[this.checkboxGroupQuestion].hasSubcommittee) {
            this.checkboxGroup.questions[this.checkboxGroupQuestion].hasSubcommittee = true;
            this.toastr.error('hasSubcommittee cannot be disabled with active subcommittee members');
        }
        
        if (activeStaff && !this.checkboxGroup.questions[this.checkboxGroupQuestion].hasStaff) {
            this.checkboxGroup.questions[this.checkboxGroupQuestion].hasStaff = true;
            this.toastr.error('hasStaff cannot be disabled with active staff members');
        }
        
        if (activeLocations && !this.checkboxGroup.questions[this.checkboxGroupQuestion].hasLocations) {
            this.checkboxGroup.questions[this.checkboxGroupQuestion].hasLocations = true;
            this.toastr.error('hasLocations cannot be disabled with active locations');
        }
        
        if (activeForms && !this.checkboxGroup.questions[this.checkboxGroupQuestion].hasForms) {
            this.checkboxGroup.questions[this.checkboxGroupQuestion].hasForms = true;
            this.toastr.error('hasForms cannot be disabled with configured forms');
        }
        
        if (this.checkboxGroup.questions[this.checkboxGroupQuestion].hasLocationStaffing) {
            if (!this.checkboxGroup.questions[this.checkboxGroupQuestion].hasLocations ||
                    !this.checkboxGroup.questions[this.checkboxGroupQuestion].hasStaff) {
                if (modifiedFeature === 'hasLocationStaffing') {
                    this.checkboxGroup.questions[this.checkboxGroupQuestion].hasLocationStaffing = false;
                    this.toastr.error('hasLocationStaffing can only be enabled when both hasStaff and hasLocations are enabled');
                } else if (modifiedFeature === 'hasLocations') {
                    this.checkboxGroup.questions[this.checkboxGroupQuestion].hasLocations = true;
                    this.toastr.error('hasLocations cannot be disabled when hasLocationStaffing is enabled');
                } else if (modifiedFeature === 'hasStaff') {
                    this.checkboxGroup.questions[this.checkboxGroupQuestion].hasLocations = true;
                    this.toastr.error('hasStaff cannot be disabled when hasLocationStaffing is enabled');
                }
            }
        }
    }
    
    getOtherLocationNames() {
        let nameList = [];
        let cards = this.getCardInstances('Location');
        for (let cardIdx in cards) {
            nameList.push(this.getResponseOfQuestionById(cards[cardIdx].responses, 963).value);
        }
        
        return nameList;
    }
    
    sortedLocationCards() {
        // shallow copy array of cards
        let cards = this.getCardInstances('Location').concat();
        cards.sort((a,b) => {
            let aName = this.getResponseOfQuestionById(a.responses, 963).value;
            let bName = this.getResponseOfQuestionById(b.responses, 963).value;
            if (aName > bName) {
                return 1;
            }
            if (bName > aName) {
                return -1;
            }
            return 0;
        });
        return cards;
    }
    
    sortedPersonCards(inCards) {
        // shallow copy array of cards
        let cards = inCards.concat();
        cards.sort((a,b) => {
            let aName = this.getResponseOfQuestionById(a.responses, 957).value + ' ' + this.getResponseOfQuestionById(a.responses, 958).value;
            let bName = this.getResponseOfQuestionById(b.responses, 957).value + ' ' + this.getResponseOfQuestionById(b.responses, 958).value;
            if (aName > bName) {
                return 1;
            }
            if (bName > aName) {
                return -1;
            }
            return 0;
        });
        return cards;
    }
    
    openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name, restrictNameList=null) {
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
                constants: () => null,
                restrictNameList: () => restrictNameList,
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
    
    openCommitteeModal(card=null, isAdd = false, idx=null) {
        this.commonModal(card, isAdd, idx, BaseModalController, 'CommitteeModalController',
                committeeModalTemplate, 'Commitee Members');
    }
    
    openStaffModal(card=null, isAdd = false, idx=null) {
        this.commonModal(card, isAdd, idx, StationModalController, 'StaffModalController',
                staffModalTemplate, 'Staff');
    }
    
    openLocationModal(card=null, isAdd = false, idx=null) {
        this.commonModal(card, isAdd, idx, StationModalController, 'LocationModalController',
                locationModalTemplate, 'Location', this.getOtherLocationNames());
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
        this.checkboxGroup.updateResponses();
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