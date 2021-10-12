import {BaseFormController} from '../baseFormController.js';
import {IrfStubController} from '../cif/irfStub.js';
const CheckboxGroup = require('../checkboxGroup.js');

export class BaseLegalCaseController extends BaseFormController {
    constructor($scope, $uibModal, constants, LegalCaseService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, IrfService, SessionService) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);
        
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = LegalCaseService;
        this.irfService = IrfService;
        this.session = SessionService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.irfRef = null;
        this.cifRefs = [];
        this.locations = [];

        this.legalCaseNumber = "";
        this.associatedPersons = [];

        this.getLegalCase(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
        
        
        
    }
    
    formNumberChange() {
        this.goodFormNumber = (this.questions[998].response.value.match(this.formNumberPattern) !== null);
    }
    
    number_change() {
        let question_id = 998;
        let legalCaseNumber = this.questions[question_id].response.value;
        if (this.legalCaseNumber !== legalCaseNumber) {
            this.legalCaseNumber = legalCaseNumber;
            this.irf = null;
            this.tmpIrf = null;
            this.irfRef = null;
            this.cifRefs = [];
            if (legalCaseNumber !== '') {
                this.service.getRelatedForms(this.stateParams.stationId, legalCaseNumber).then((response) => {
                    let relatedForms = response.data;
                    for (let idx in relatedForms) {
                        if (relatedForms[idx].form_type === 'IRF') {
                            this.irfRef = {
                                    formNumber: relatedForms[idx].form_number,
                                    url: this.state.href(relatedForms[idx].form_name, {
                                        id: relatedForms[idx].id,
                                        stationId: relatedForms[idx].station_id,
                                        countryId: null,
                                        isViewing: false,
                                        formName: relatedForms[idx].form_name,
                                    })
                            };
                            let irfStateParams = {
                                   countryId:null,
                                   stationId:relatedForms[idx].station_id,
                                   formName:relatedForms[idx].form_name,
                                   id:relatedForms[idx].id
                            };
                            this.tmpIrf = new IrfStubController(this.$scope, this.$uibModal, this.constants, this.irfService, irfStateParams, this.state, this);
                            this.getIrfComplete();
                        } else if (relatedForms[idx].form_type === 'CIF') {
                            this.cifRefs.push(
                                    {
                                        formNumber: relatedForms[idx].form_number,
                                        url: this.state.href(relatedForms[idx].form_name, {
                                            id: relatedForms[idx].id,
                                            stationId: relatedForms[idx].station_id,
                                            countryId: null,
                                            isViewing: false,
                                            formName: relatedForms[idx].form_name,
                                        }) 
                                    });
                        }
                    }
                    if (this.irfRef === null) {
                        this.getSubIrfComplete();
                    }
                });
            }
        }
    }
    
    getSubIrfComplete() {
        
    }
    
    getIrfComplete() {
        if (this.tmpIrf.questions && this.tmpIrf.questions[1] && this.tmpIrf.questions[1].response.value !== '') {
            this.irf = this.tmpIrf;
            this.associatedPersons = this.irf.getIntercepteePersons('PVOT');
        }
        this.getSubIrfComplete();
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
                    this.questions[997].response.value = 'active';
                } else {
                    this.set_errors_and_warnings(response.data);
                    this.messagesEnabled = true;
                }
                if (this.questions[998].response.value === null || this.questions[998].response.value === '') {
                    this.questions[998].response.value = this.response.station_code;
                }
                this.station_name = this.response.station_name;
                this.formNumberPattern = '^' + this.response.station_code + '[0-9]{3,}[A-Z]{0,1}$';
                this.formNumberChange();
                if (this.goodFormNumber) {
                    this.number_change();
                }
                this.getLocations(this.stateParams.stationId);
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
