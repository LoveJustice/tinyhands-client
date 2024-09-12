import {BaseFormController} from '../baseFormController.js';

export class BasePvfController extends BaseFormController {
    constructor($scope, $uibModal, constants, PvfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService, IncidentService, BaseUrlService) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack, BaseUrlService);
        
        this.incidentService = IncidentService;
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = PvfService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.session = SessionService;
        this.goodFormNumber = false;

        this.pvfNumber = "";
        this.associatedPersons = [];
        this.tableDivSize = (window.innerWidth - 50) + 'px';

        this.getPvf(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
    }
    
    formNumberChange() {
        this.goodFormNumber = (this.questions.pvfTopPvfNumber.response.value.match(this.formNumberPattern) !== null);
    }
    
    getRelatedFormsComplete() {
        this.excludeRelatedForm('PVF', this.questions.pvfTopPvfNumber.response.value);
    }
    
    number_change() {
        let question_id = 'pvfTopPvfNumber';
        let pvfNumber = this.questions[question_id].response.value;
        if (this.pvfNumber !== pvfNumber) {
            this.pvfNumber = pvfNumber;
            if (pvfNumber === '') {
                this.associatedPersons = [];
            } else {
                this.service.getAssociatedPersons(this.stateParams.stationId, pvfNumber).then((response) => {
                    this.associatedPersons = response.data;
                });
                this.gospelQuestions = null;
                this.service.getGospelVerification(this.stateParams.stationId, pvfNumber).then((response) => {
                    this.gospelQuestions = _.keyBy(response.data.responses, (x) => x.question_tag);
                });
            }
        }
    }
    
    getPvfComplete() {
    }

    getPvf(countryId, stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getPvf(countryId, stationId, id).then((response) => {
                this.processResponse(response);
                
                if (this.stateParams.id !== null && this.questions.pvfTopPvfNumber.response.value !== null) {
                    this.relatedUrl = this.state.href('relatedForms', {
                        stationId: this.stateParams.stationId,
                        formNumber: this.questions.pvfTopPvfNumber.response.value
                    });
                }
                
                let items = ['Parent','Sibling','Grandparent','Aunt/Uncle','Spouse'];
                this.otherData.setRadioButton(items, 'pvfPvInfoPv-guardian_relationship', 'basic', this.questions.pvfPvInfoPv.response.guardian_relationship.value);
                let educationItems=['None/Illiterate','Primary','Secondary','University'];
                this.otherData.setRadioButton(educationItems, 'pvfPvInfoPv-education', 'basic', this.questions.pvfPvInfoPv.response.education.value);
                this.getPvfComplete();
                
                if (this.questions.pvfTopPvfNumber.response.value === null || this.questions.pvfTopPvfNumber.response.value === '') {
                	this.incidentService.getIncident(this.stateParams.incidentId).then((response) => {
                		this.incidentNumber = response.data.incident_number;
                		this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.incidentNumber);
            			this.getIncidentNames([this.incidentNumber]);
                		this.questions.pvfTopPvfNumber.response.value = this.incidentNumber;
                		this.formNumberPattern = '^' + this.incidentNumber + '[A-Z]{1,2}$';
                		this.formNumberChange();
                		this.number_change();
                	});
	            } else {
	            	this.incidentNumber = this.getIncidentNumberFromFormNumber(this.questions.pvfTopPvfNumber.response.value);
	            	this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.incidentNumber);
            		this.getIncidentNames([this.incidentNumber]);
	            	this.formNumberPattern = '^' + this.incidentNumber+ '[A-Z]{1,2}$';
	                this.formNumberChange();
	                this.number_change();
	            }
            });
        });
    }
    
    existingPvf() {
    }
    
    newPvf() {
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
                parentController: () => this,
                associatedPersons: () => this.associatedPersons
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
            this.autoSaveModified = true;
            this.autoSave();
        });
    }
    
    getUploadFileQuestions() {
        return [692];
    }
    
    // Override in subclass for implementation specific features
    saveExtra() {   
    }
   
    save() {
        this.response.status = 'in-progress';
        this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
        this.outCustomHandling();
        this.saveExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.service.submitPvf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
         this.response = response.data;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
            if (this.stateParams.id === null) {
             this.stateParams.id = response.data.id;
            }
            this.state.go('pvfList');
        }, (error) => {
            this.set_errors_and_warnings(error.data);
           });
         this.messagesEnabled = false;
    }
    
    // Override in subclass for implementation specific features
    submitExtra() {
    }

    submit() {
        this.saved_status = this.response.status;
        let x = this.questions[this.config.TotalFlagId];
        x.response.value = this.redFlagTotal;
        this.outCustomHandling();
        this.submitExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.response.status = 'approved';
        if (this.ignoreWarnings) {
            this.response.ignore_warnings = 'True';
        } else {
            this.response.ignore_warnings = 'False';
        }
        this.service.submitPvf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
             this.response = response.data;
             this.responses = response.data.responses;
             this.setupQuestions(this.responses);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
                 this.stateParams.id = response.data.id;
             }
             this.state.go('pvfList');
         }, (error) => {
             this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
        
        this.messagesEnabled = true;
    }
    
    autoSaveInterval() {
        return 30000;
    }
    
    autoSaveHasMinimumData() {
        if (this.questions.pvfTopPvfNumber.response.value === null || this.questions.pvfTopPvfNumber.response.value === '' || this.goodFormNumber === false) {
            return false;
        }
        return true;
    }
    
    doAutoSave() {
        this.response.status = 'in-progress';
        this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
        this.outCustomHandling();
        this.saveExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.spinner.show('Auto saving PVF...');
        this.service.submitPvf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
            this.stateParams.id = response.data.storage_id;
            this.processResponse(response);
            this.getPvfComplete();
            if (this.stateParams.id !== null && this.questions.pvfTopPvfNumber.response.value !== null) {
                this.relatedUrl = this.state.href('relatedForms', {
                    stationId: this.stateParams.stationId,
                    formNumber: this.questions.pvfTopPvfNumber.response.value
                });
            }
            this.spinner.hide();
        }, (error) => {
            this.set_errors_and_warnings(error.data);
            this.spinner.hide();
           });
        this.messagesEnabled = false;
    }
}

export default {
    BasePvfController
};
