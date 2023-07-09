import {BaseFormController} from '../baseFormController.js';
import {IrfStubController} from '../cif/irfStub.js';

export class BaseLegalCaseController extends BaseFormController {
    constructor($scope, $uibModal, constants, LegalCaseService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, IrfService, SessionService, IncidentService) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);
        
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = LegalCaseService;
        this.irfService = IrfService;
        this.session = SessionService;
        this.incidentService = IncidentService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.irfRef = null;
        this.cifRefs = [];
        this.locations = [];

        this.legalCaseNumber = "";
        this.associatedPersons = [];
        this.tableDivSize = (window.innerWidth - 50) + 'px';

        this.getLegalCase(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
        
        
        
    }
    
    formNumberChange() {
        this.goodFormNumber = (this.questions[998].response.value.match(this.formNumberPattern) !== null);
    }
    
    getRelatedFormsComplete() {
        this.excludeRelatedForm('LEGAL_CASE', this.questions[998].response.value);
        if (this.relatedForms.IRF) {
            let irfStateParams = {
                    countryId:this.relatedForms.IRF[0].countryId,
                    stationId:this.relatedForms.IRF[0].stationId,
                    formName:this.relatedForms.IRF[0].formName,
                    id:this.relatedForms.IRF[0].id
             };
            this.tmpIrf = new IrfStubController(this.$scope, this.$uibModal, this.constants, this.irfService, irfStateParams, this.state, this);
            this.getIrfComplete();
        }
    }
    
    getIrfComplete() {
        if (this.tmpIrf.questions && this.tmpIrf.questions[1] && this.tmpIrf.questions[1].response.value !== '') {
            this.irf = this.tmpIrf;
            this.associatedPersons = this.irf.getIntercepteePersons('PVOT');
        }
    }
    
    copyIrfData() {
        let victims = this.irf.getIntercepteePersons('PVOT');
        let victimCards = this.getCardInstances('Victims');
        for (let idx=0; idx < victims.length; idx++) {
            let found = false;
            for (let idx1=0; idx1 < victimCards.length; idx1++) {
                let cardQuestions = _.keyBy(victimCards[idx1].responses, (x) => x.question_id);
                if (victims[idx].name.value === cardQuestions[9].response.name.value) {
                    found = true;
                }
            }
            if (!found) {
                let card = this.createCard('Victims');
                let suspectCardQuestions = _.keyBy(card.responses, (x) => x.question_id);
                suspectCardQuestions[9].response = _.cloneDeep(victims[idx]);
                suspectCardQuestions[9].response.link_id = suspectCardQuestions[9].response.storage_id;
                suspectCardQuestions[9].response.storage_id = null;
                victimCards.push(card);
            }
        }
        
        let suspects = this.irf.getIntercepteePersons('Suspect');
        let suspectCards = this.getCardInstances('Suspects');
        for (let idx=0; idx < suspects.length; idx++) {
            let found = false;
            for (let idx1=0; idx1 < suspectCards.length; idx1++) {
                let cardQuestions = _.keyBy(suspectCards[idx1].responses, (x) => x.question_id);
                if (suspects[idx].name.value === cardQuestions[9].response.name.value) {
                    found = true;
                }
            }
            if (!found) {
                let card = this.createCard('Suspects');
                let suspectCardQuestions = _.keyBy(card.responses, (x) => x.question_id);
                suspectCardQuestions[9].response = _.cloneDeep(suspects[idx]);
                suspectCardQuestions[9].response.link_id = suspectCardQuestions[9].response.storage_id;
                suspectCardQuestions[9].response.storage_id = null;
                suspectCards.push(card);
            }
        }
        
        this.otherData.setRadioButton(this.locations, 3, 'basic', this.irf.questions[3].response.value);
    }
    
    getLocations(stationId) {
        this.service.getLocation(stationId).then ((response) => {
            this.locations = response.data.map((x) => x.name);
            this.otherData.setRadioButton(this.locations, 3);
        });
    }
    
    getLegalCaseComplete() {
    }

    getLegalCase(countryId, stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getLegalCase(countryId, stationId, id).then((response) => {
                this.errorMessages = [];
                this.warningMessages = [];
                this.processResponse(response);
                let timelineCards = this.getCardInstances('Timeline');
                timelineCards.sort(BaseLegalCaseController.compareTimelineEntries);
                if (this.stateParams.id === null) {
                	this.incidentService.getIncident(this.stateParams.incidentId).then((response) => {
	                	this.incidentNumber = response.data.incident_number;
	                	this.questions[998].response.value = this.incidentNumber;
	                    this.questions[997].response.value = 'active';
	                    this.formNumberPattern = '^' + this.incidentNumber+ '[A-Z]{0,2}$';
                		this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.incidentNumber);
                		this.formNumberChange();
	                });
                } else {
         			this.incidentNumber = this.getIncidentNumberFromFormNumber(this.questions[998].response.value);
                    this.set_errors_and_warnings(response.data);
                    this.messagesEnabled = true;
                    this.formNumberPattern = '^' + this.incidentNumber+ '[A-Z]{0,2}$';
                	this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.incidentNumber);
                	this.formNumberChange();
                }
                this.station_name = this.response.station_name;
                this.formNumberChange();
                this.getLocations(this.stateParams.stationId);
                this.getLegalCaseComplete();
            });
        });
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
                parentController: ()=> this,
                caseStatus: () => this.questions[997].response.value,
                userName: () => this.session.user.first_name + ' ' + this.session.user.last_name,
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
                    cards.sort(BaseLegalCaseController.compareTimelineEntries);
                }
            }
        });
    }
    
    getUploadFileQuestions() {
        return [1020];
    }
    
    static getTimelineResponseValue(entry, question_id) {
        for (let idx=0; idx < entry.responses.length; idx++) {
            if (entry.responses[idx].question_id === question_id) {
                return entry.responses[idx].response.value;
            }
        }
        return null;
    }
    
    static compareTimelineEntries(a,b) {
        let aValue = BaseLegalCaseController.getTimelineResponseValue(a, 1035);
        let bValue = BaseLegalCaseController.getTimelineResponseValue(b, 1035);
        if (aValue < bValue) {
            return 1;
        } else if (aValue > bValue) {
            return -1;
        } else {
            if (a.storage_id) {
                if (b.storage_id) {
                    return b.storage_id - a.storage_id;
                } else {
                    return 1;
                }
            } else {
                return -1;
            }
        }
    }

    
    // Override in subclass for implementation specific features
    submitExtra() {
    }

    submit() {
        this.saved_status = this.response.status;
        this.outCustomHandling();
        this.submitExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        let submission_date = this.dateData.dateToString(new Date());
        let suspectCards = this.getCardInstances('Suspects');
        for (let card=0; card < suspectCards.length; card++) {
        	let cardQuestions = _.keyBy(suspectCards[card].responses, (x) => x.question_id);
        	
        	if (cardQuestions[1013].response.value && !cardQuestions[1043].response.value) {
        		cardQuestions[1043].response.value = submission_date;
        	}
        	if (cardQuestions[1011].response.value && !cardQuestions[1044].response.value) {
        		cardQuestions[1044].response.value = submission_date;
        	}
        }
        if (this.ignoreWarnings) {
            this.response.ignore_warnings = 'True';
        } else {
            this.response.ignore_warnings = 'False';
        }
        this.service.submitLegalCase(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
             this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
                 this.stateParams.id = response.data.id;
             }
             this.state.go('legalCaseList');
         }, (error) => {
             this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
        
        this.messagesEnabled = true;
    }
}

export default {
    BaseLegalCaseController
};
