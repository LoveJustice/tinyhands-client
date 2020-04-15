import {BaseFormController} from '../baseFormController.js';
import printCardTemplate from './common/printCardTemplate.html';
import {IrfStubController} from './irfStub.js';

export class BaseCifController extends BaseFormController {
    constructor($scope, $uibModal, constants, CifService, $stateParams, $state, $timeout, IrfService,  SpinnerOverlayService, $uibModalStack) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);

        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = CifService;
        this.irfService = IrfService;
        this.state = $state;
        this.timeout = $timeout;
        this.relatedUrl = null;
        this.spinner = SpinnerOverlayService;
       
        this.cifNumber = "";
        this.associatedPersons = [];
        this.printCardTemplate = printCardTemplate;
        this.printMode = false;
        this.relatedTimer = null;
        this.irf = null;
        this.tmpIrf = null;
        this.config = {};

        this.getCif(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
    }
    
    old_number_change() {
        let question_id = 287;
        let cifNumber = this.questions[question_id].response.value;
        if (this.cifNumber !== cifNumber) {
            this.cifNumber = cifNumber;
            if (cifNumber === '') {
                this.associatedPersons = [];
            } else {
                this.service.getAssociatedPersons(this.stateParams.stationId, cifNumber).then((response) => {
                    this.associatedPersons = response.data;
                });
            }
        }
    }
    
    number_change() {
        let question_id = 287;
        let cifNumber = this.questions[question_id].response.value;
        if (this.cifNumber !== cifNumber) {
            this.cifNumber = cifNumber;
            this.irf = null;
            this.tmpIrf = null;
            if (cifNumber !== '') {
                this.service.getRelatedForms(this.stateParams.stationId, cifNumber).then((response) => {
                    let relatedForms = response.data;
                    for (let idx in relatedForms) {
                        if (relatedForms[idx].form_type === 'IRF') {
                            let irfStateParams = {
                                   countryId:null,
                                   stationId:relatedForms[idx].station_id,
                                   formName:relatedForms[idx].form_name,
                                   id:relatedForms[idx].id
                            };
                            this.tmpIrf = new IrfStubController(this.$scope, this.$uibModal, this.constants, this.irfService, irfStateParams, this.state, this);
                        }
                    }
                });
            }
        }
    }
    
    getIrfComplete() {
        if (this.tmpIrf.questions[1].response.value !== '') {
            this.irf = this.tmpIrf;
            this.associatedPersons = this.irf.getIntercepteePersons('PVOT');
        }
    }
    
    copyIrfData() {
        this.questions[2].response = this.irf.questions[2].response;
        this.questions[5].response = this.irf.questions[5].response;
        this.otherData.questions[289].value = 'Intercept';
        this.otherData.questions[289].otherValue = '';
        if (this.irf.questions[4].response.value) {
            let dateParts = this.irf.questions[4].response.value.split(' ');
            this.dateData.questions[479] = {dateType:'basic', value:this.dateData.dateAsUTC(dateParts[0])};
        }
        
        if (this.associatedPersons.length === 1) {
            let personCopy = _.cloneDeep(this.associatedPersons[0]);
            for (let key in this.questions[292].response.identifiers) {
                if (!(key in personCopy.identifiers)) {
                    personCopy.identifiers[key] =  this.questions[292].response.identifiers[key];
                    personCopy.identifiers[key].location.value = '';
                    personCopy.identifiers[key].number.value = '';
                }
            }
            this.questions[292].response = personCopy;
            let dateValue = '';
            if (personCopy.birthdate && personCopy.birthdate.value !== null && personCopy.birthdate.value !== '') {
                dateValue = new Date(personCopy.birthdate.value);
            }
            this.dateData.questions[292] = {dateType:'person', value:dateValue};
            if (this.personIdentifierChoice.questions[292].radioValue) {
                for (let key in this.associatedPersons[0].identifiers) {
                    this.personIdentifierChoice.questions[292].radioValue =  key;
                    break;
                }
            }
        }
        
        let suspects = this.irf.getIntercepteePersons('Suspect');
        let personBoxes = this.getCardInstances('PersonBoxes');
        for (let idx=0; idx < suspects.length; idx++) {
            let found = false;
            for (let idx1=0; idx1 < personBoxes.length; idx1++) {
                let cardQuestions = _.keyBy(personBoxes[idx1].responses, (x) => x.question_id);
                if (suspects[idx].name.value === cardQuestions[9].response.name.value) {
                    found = true;
                }
            }
            if (!found) {
                let card = this.createCard('PersonBoxes');
                let personBoxQuestions = _.keyBy(card.responses, (x) => x.question_id);
                personBoxQuestions[9].response = suspects[idx];
                personBoxes.push(card);
            }
        }
        
    }
    

    getCif(countryId, stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getCif(countryId, stationId, id).then((response) => {
                this.processResponse(response, id);
                this.number_change();
                if (this.stateParams.id !== null && this.questions[287].response.value !== null) {
                    this.relatedUrl = this.state.href('relatedForms', {
                        stationId: this.stateParams.stationId,
                        formNumber: this.questions[287].response.value
                    });
                }
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
                identificationTypes: () => this.getDefaultIdentificationTypes(),
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
    
    associatedPersonChange(person) {
        if (this.associatedPersons.length < 2) {
            // no additonal persons for which to crate other potential victims cards
            return;
        }
        let selectedPersonName = person.name.value;
        let otherPvs = this.getCardInstances('OtherPotentialVictims');
        let removeIndex = -1;
        for (let idx=0; idx < otherPvs.length; idx++) {
            let cardQuestions = _.keyBy(otherPvs[idx].responses, (x) => x.question_id);
            let otherPvName = cardQuestions[300].response.name.value;
            if (otherPvName === selectedPersonName) {
                removeIndex = idx;
            }
        }
        if (removeIndex >= 0) {
            otherPvs.splice(removeIndex, 1);
        }
        for (let idx=0; idx < this.associatedPersons.length; idx++) {
            if (this.associatedPersons[idx].name.value === selectedPersonName) {
                continue;
            }
            let found = false;
            for (let idx1=0; idx1 < otherPvs.length; idx1++) {
                let cardQuestions = _.keyBy(otherPvs[idx1].responses, (x) => x.question_id);
                if (this.associatedPersons[idx].name.value === cardQuestions[300].response.name.value) {
                    // already an entry for this person
                    found = true;
                }
            }
           
            if (!found) {
                let card = this.createCard('OtherPotentialVictims');
                let otherPvQuestions = _.keyBy(card.responses, (x) => x.question_id);
                otherPvQuestions[300].response = this.associatedPersons[idx];
                otherPvs.push(card);
            } 
        }
    }
    
    // Override in subclass for implementation specific features
    saveExtra() {	
    }
   
    save() {
    	this.response.status = 'in-progress';
    	this.processPersons('Out');
    	this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
    	this.outCustomHandling();
    	this.saveExtra();
    	this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
    	this.service.submitCif(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
   		 this.response = response.data;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
            if (this.stateParams.id === null) {
           	 this.stateParams.id = response.data.id;
            }
            this.state.go('cifList');
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
    	this.processPersons('Out');
    	this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
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
    	this.service.submitCif(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
    		 this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
            	 this.stateParams.id = response.data.id;
             }
             this.state.go('cifList');
         }, (error) => {
        	 this.set_errors_and_warnings(error.data);
             this.response.status = this.saved_status;
            });
    	
        this.messagesEnabled = true;
    }
    
    getSimpleQuestions(config) {
        let simpleQuestions = config.Basic.concat(config.Date);
        for (let otherIdx in config.RadioOther) {
            if (config.Person.indexOf(config.RadioOther[otherIdx]) < 0) {
                simpleQuestions.push(config.RadioOther[otherIdx]);
            }
        }
        return simpleQuestions;
    }
    
    cifPrint() {
        this.printMode=true;
        this.timeout(() => {
            window.print();
            this.printMode=false;
        }, 1000);
    }

    autoSaveInterval() {
        return 30000;
    }

    autoSaveHasMinimumData() {
        if (this.questions[287].response.value === null || this.questions[287].response.value === '') {
            return false;
        }
        
        return true;
    }

    doAutoSave() {
        this.response.status = 'in-progress';
        this.processPersons('Out');
        this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
        this.outCustomHandling();
        this.saveExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.spinner.show('Auto saving CIF...');
        this.service.submitCif(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
            this.stateParams.id = response.data.storage_id;
            this.processResponse(response, this.stateParams.id);
            this.number_change();
            if (this.stateParams.id !== null && this.questions[287].response.value !== null) {
                this.relatedUrl = this.state.href('relatedForms', {
                    stationId: this.stateParams.stationId,
                    formNumber: this.questions[287].response.value
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
	BaseCifController
};
