/* global jQuery */
const OtherData = require('./otherData.js');
const DateData = require('./dateData.js');
const PersonIdentifierChoice = require('./personIdentifierChoice.js');

export class BaseFormController {
    constructor($scope, $stateParams, $uibModalStack) {
        'ngInject';
        this.$scope = $scope;
        this.stateParams = $stateParams;
        this.$uibModalStack = $uibModalStack;
        this.isViewing = this.stateParams.isViewing === 'true';
        this.stationId = this.stateParams.stationId;
        
        $scope.$on('$destroy', function iVeBeenDismissed() {
            let ctrl = $scope.$ctrl;
            if (ctrl.$uibModalStack) {
                ctrl.$uibModalStack.dismissAll();
            }
          });

        this.response = {status:'in-progress'};
        this.ignoreWarnings = false;
        this.messagesEnabled = false;
        this.redFlagTotal = 0;
        this.flagContextCount = {};
        this.selectedStep = 0;
        this.autoSaveModified = false;
        this.lastAutoSave = null;
       
        this.errorMessages = [];
        this.warningMessages = [];
        
        this.setupFlagListener();
    }
    
    getErrorMessages() {
        return this.errorMessages;
    }
    
    getWarningMessages() {
        return this.warningMessages;
    }


    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }
    
    // Override in subclass to select a default identification types
    getDefaultIdentificationTypes() {
        return [];
    }
    
    processPersonIdentificationIn(question) {
        if (!question.storage_id && (!question.response || !question.response.name)) {
            question.response = {
                storage_id: null,
                name: {
                    value: ""
                },
                address1: {
                    id: null,
                    name: ""
                },
                address2: {
                    id: null,
                    name: ""
                },
                phone: {
                    value: ""
                },
                gender: {
                    value: ""
                },
                age: {
                    value: null
                },
                birthdate: {
                        value:""
                },
                nationality: {
                    value: ""
                },
                identifiers: {}
            };
        }
        let defaultTypes = this.getDefaultIdentificationTypes();
        for (let idx in defaultTypes) {
            if (!(defaultTypes[idx] in question.response.identifiers)) {
                question.response.identifiers[defaultTypes[idx]] = {
                        type: {value:defaultTypes[idx]},
                        number: {value:""},
                        location: {value:""}
                };
            }
        }
    }
    
    processPersonIdentificationOut (question) {
        let toDelete = [];
        for (let theKey in question.response.identifiers) {
            if (question.response.identifiers[theKey].number.value === '' || question.response.identifiers[theKey].type.value === '') {
                toDelete.push(theKey);
            }
        }
        for (let idx in toDelete) {
            delete question.response.identifiers[toDelete[idx]];
        }
    }
    
    processPersonResponses(responses, personConfigList, phase, mainForm) {
        for (let idx in responses) {
            if (personConfigList.indexOf(responses[idx].question_id) > -1) {
                if (phase === 'In') {
                    this.processPersonIdentificationIn(responses[idx]);
                    if (mainForm && this.personIdentifierChoice) {
                        this.personIdentifierChoice.manage(responses[idx].question_id);
                    }
                } else if (phase === 'Out') {
                    this.processPersonIdentificationOut(responses[idx]);
                }
            }
        }
    }
    
    processPersons(phase) {
        let identificationTypes = this.getDefaultIdentificationTypes();
        if (identificationTypes.length > 0) {
            if (phase === 'In') {
                this.personIdentifierChoice = new PersonIdentifierChoice(this.questions, identificationTypes);
            }
        } else {
            this.personIdentifierChoice = null;
        }
        // Main form
        if (this.config.hasOwnProperty('Person')) {
            this.processPersonResponses(this.responses, this.config.Person, phase, true);
        }
        
        // Process cards
        for (let key in this.config) {
            if (this.config[key].hasOwnProperty('Person')) {
                let cards = this.getCardInstances(key);
                for (let cardIdx in cards) {
                    this.processPersonResponses(cards[cardIdx].responses, this.config[key].Person, phase, false);
                }
            }
        }
    }

    processResponse(response) {
        this.response = response.data;
        this.responses = response.data.responses;
        this.questions = _.keyBy(this.responses, (x) => x.question_id);
        for (let idx=0; idx < this.response.cards.length; idx++) {
            for (let idx1=0; idx1 < this.response.cards[idx].instances.length; idx1++) {
                this.redFlagTotal += this.response.cards[idx].instances[idx1].flag_count;
            }
        }
        if (this.response.status === null || this.response.status === '' || this.response.status === 'pending') {
            this.response.status = 'in-progress';
        }

        // Copy response data for auto-save compare
        let originalResponse = jQuery.extend(true, {}, this.response);
        this.originalQuestions = _.keyBy(originalResponse.responses, (x) => x.question_id);
        this.autoSaveModified = false;
        if (this.response.status === 'in-progress' && this.autoSaveInterval() > 0) {
            this.lastAutoSave = new Date();
        } else {
            this.lastAutoSave = null;
        }

        this.processPersons('In');
        this.inCustomHandling();
    }

    inCustomHandling() {
        this.setValuesForOtherInputs();
        this.setValuesForDateInputs();
    }

    outCustomHandling() {
        this.otherData.updateResponses();
        this.dateData.updateResponses();
    }

    setValuesForOtherInputs() {
        this.otherData = new OtherData(this.questions);
        if (this.config.hasOwnProperty('RadioOther')) {
            for (let idx=0; idx < this.config.RadioOther.length; idx++) {
                let questionId = this.config.RadioOther[idx];
                this.otherData.setRadioButton(this.config.RadioItems[questionId], questionId);
            }
        }
    }

    setValuesForDateInputs() {
        this.dateData = new DateData(this.questions);
        if (this.config.hasOwnProperty('Date')) {
            for (let idx=0; idx < this.config.Date.length; idx++) {
                let questionId = this.config.Date[idx];
                this.dateData.setDate(questionId,'basic');
            }
        }
        if (this.config.hasOwnProperty('Person')) {
            for (let idx=0; idx < this.config.Person.length; idx++) {
                let questionId = this.config.Person[idx];
                this.dateData.setDate(questionId,'person');
            }
        }
    }

    getResponseOfQuestionById(responses, questionId) {
        return _.find(responses, (x) => x.question_id === questionId).response;
    }

    incrementRedFlags(numberOfFlagsToAdd, context) {
        this.redFlagTotal += numberOfFlagsToAdd;
        if (context) {
            if (!(context in this.flagContextCount)) {
                this.flagContextCount[context] = numberOfFlagsToAdd;
            } else {
                this.flagContextCount[context] += numberOfFlagsToAdd;
            }
        }
    }

    getContextCount(context) {
        if (!(context in this.flagContextCount)) {
            this.flagContextCount[context] = 0;
        }
        
        return this.flagContextCount[context];
    }
    
    createCard(config_name) {
        let config = this.config[config_name];
        let the_card = {
            storage_id:null,
            flag_count:0,
            responses:[]
        };
        let indexQuestion = -1;
        let lastIndex = 0;
        if (config.hasOwnProperty('IndexQuestion')) {
            indexQuestion = config.IndexQuestion;
            let cards = this.getCardInstances(config_name);
            
            for (let idx=0; idx < cards.length; idx++) {
                let card = cards[idx];
                let value = null;
                for (let respIdx=0; respIdx < card.responses.length; respIdx++) {
                    if (card.responses[respIdx].question_id === indexQuestion) {
                        value = card.responses[respIdx].response.value;
                        break;
                    }
                }
                if (value !== null && value !== '') {
                    lastIndex = value;
                }
            }
            
        }
        if (config.hasOwnProperty('Person')) {
            for (let idx=0; idx < config.Person.length; idx++) {
                the_card.responses.push({
                    question_id: config.Person[idx],
                    response: {
                        gender: {
                            value: ""
                        },
                        name: {},
                        age: {},
                        birthdate:{},
                        address1: {
                            id: null,
                            name: ""
                        },
                        address2: {
                            id: null,
                            name: ""
                        },
                        phone: {},
                        nationality: {},
                        identifiers: {}
                    }
                });
            }
        }
        if (config.hasOwnProperty('Address')) {
            for (let idx=0; idx < config.Address.length; idx++) {
                the_card.responses.push({
                    question_id: config.Address[idx],
                    response: {
                        address1: {
                            id: null,
                            name: ""
                        },
                        address2: {
                            id: null,
                            name: ""
                        }
                    }
                });
            }
        }
        if (config.hasOwnProperty('Basic')) {
            for (let idx=0; idx < config.Basic.length; idx++) {
                if (config.Basic[idx] === indexQuestion) {
                    the_card.responses.push({question_id: config.Basic[idx], response: {value: lastIndex+1}});
                } else {
                    if (config.hasOwnProperty('FormDefault') && config.Basic[idx] in config.FormDefault) {
                        the_card.responses.push({question_id: config.Basic[idx], response:config.FormDefault[config.Basic[idx]]});
                    } else {
                        the_card.responses.push({question_id: config.Basic[idx], response: {value:null}});
                    }
                }
            }
        }
        if (config.hasOwnProperty('Date')) {
            for (let idx=0; idx < config.Date.length; idx++) {
                the_card.responses.push({question_id: config.Date[idx], response: {value:null}});
            }
        }
        if (config.hasOwnProperty('RadioOther')) {
            for (let idx=0; idx < config.RadioOther.length; idx++) {
                if (!(config.hasOwnProperty('Person') && config.Person.indexOf(config.RadioOther[idx]) > -1)) {
                    the_card.responses.push({question_id: config.RadioOther[idx], response: {value:null}});
                }
            }
        }
        return the_card;
    }
    
    // Override in subclass for implementation specific features
    openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name) {
        /*jshint unused: false */
    }
    
    commonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name, options = {}) {
        let config = this.config[config_name];
        if (isAdd) {
            the_card = this.createCard(config_name);
        }
        
        if (config.hasOwnProperty('Person')) {
            for (let idx in the_card.responses) {
                if (config.Person.indexOf(the_card.responses[idx].question_id) > -1) {
                    this.processPersonIdentificationIn(the_card.responses[idx]);
                }
            }
        }
        
        this.openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name, options);
    }
    
    set_errors_and_warnings(response) {
        if (response.errors !== null) {
            if (response.errors instanceof Array) {
                this.errorMessages = response.errors;
            } else {
                this.errorMessages = [response.errors];
            }
        } else {
            this.errorMessages = [];
        }
        if (response.warnings !== null) {
            if (response.warnings instanceof Array) {
                this.warningMessages = response.warnings;
            } else {
                this.warningMessages = [response.warnings];
            }
        } else {
            this.warningMessages = [];
        }
    }

    // Override in subclass for implementation specific features
    save() {
    }

    // Override in subclass for implementation specific features
    submit() {
    }

    setupFlagListener() {
        this.$scope.$on('flagTotalCheck', (event, flagData) => {
            this.incrementRedFlags(flagData.numberOfFlagsToAdd, flagData.flagContext);
        });
    }

    isString(val) {
        return typeof val === 'string';
    }

    showIgnoreWarningsCheckbox() {
        return (this.messagesEnabled && this.warningMessages.length > 0) || this.ignoreWarnings;
    }

    getCardInstances(constant_name) {
        if (!this.config || !this.config.hasOwnProperty(constant_name) || !this.response || !this.response.cards) {
            return [];
        }
        let category_id = this.config[constant_name].Category;
        if (this.response !== null && this.response.cards !== null) {
            for (let idx=0; idx < this.response.cards.length; idx++) {
                if (this.response.cards[idx].category_id === category_id) {
                    return this.response.cards[idx].instances;
                }
            }
        }

        return [];
    }

    // Override in subclass and set to non-zero value to enable auto-save
    autoSaveInterval() {
        return 0;
    }

    // Override in subclass to identify the minimum set of data values that must be populated
    // before a save should be attempted
    autoSaveHasMinimumData() {
        return false;
    }

    // Override in subclass to make the calls to the endpoint to save the form data
    doAutoSave() {
    }

    autoSave() {
        if (this.shouldAutoSave()) {
            this.doAutoSave();
            this.lastAutoSave = new Date();
            this.autoSaveModified = false;
        }
    }

    shouldAutoSave() {
        if (this.lastAutoSave === null  || this.isViewing) {
            // Auto-save is not enabled
            return false;
        }
        let elapsed = new Date() - this.lastAutoSave;
        if (elapsed < this.autoSaveInterval()) {
            // interval has not been reached yet
            return false;
        }
        if (!this.autoSaveHasMinimumData()) {
            // The minimum set of data needed to save the form has not yet been entered
            return false;
        }
        if (this.autoSaveModified) {
            // Already know form is modified (card has been modified)
            return true;
        }

        // Check if any of the basic data type question values have been modified
        if (this.config.hasOwnProperty('Basic')) {
            for (let idx=0; idx < this.config.Basic.length; idx++) {
                let questionId = this.config.Basic[idx];
                if (this.questions[questionId].response === null) {
                    if (this.originalQuestions[questionId].response !== null) {
                        return true;
                    } 
                } else if (this.originalQuestions[questionId].response === null || this.questions[questionId].response.value !== this.originalQuestions[questionId].response.value) {
                    return true;
                }
            }
        }
        // Check if any of the radio button with other data type question values have been modified
        if (this.config.hasOwnProperty('RadioOther')) {
            for (let idx=0; idx < this.config.RadioOther.length; idx++) {
                let questionId = this.config.RadioOther[idx];
                if (this.questions[questionId].response === null) {
                    if (this.otherData.getValue(questionId) !== null) {
                        return true;
                    }
                } else if (this.otherData.getValue(questionId) === null || this.questions[questionId].response.value !== this.otherData.getValue(questionId)) {
                    return true;
                }
            }
        }
        // Check if any of the date data type question values have been modified
        if (this.config.hasOwnProperty('Date')) {
            for (let idx=0; idx < this.config.Date.length; idx++) {
                let questionId = this.config.Date[idx];
                if (this.questions[questionId].response === null) {
                    if (this.dateData.getValue(questionId) !== null) {
                        return true;
                    }
                } else if (this.questions[questionId].response.value !== this.dateData.getValue(questionId)) {
                    return true;
                }
            }
        }
        // Check if any of the address data type question values have been modified
        if (this.config.hasOwnProperty('Address')) {
            for (let idx=0; idx < this.config.Address.length; idx++) {
                let questionId = this.config.Address[idx];
                if (this.questions[questionId].response === null) {
                    if (this.originalQuestions[questionId].response !== null) {
                        return true;
                    } else {
                        continue;
                    }
                } 
                if (this.originalQuestions[questionId].response === null) {
                    return true;
                }
                if (this.questions[questionId].response.address1 === null) {
                    if (this.originalQuestions[questionId].response.address1 !== null) {
                        return true;
                    }
                } else if (this.originalQuestions[questionId].response.address1 === null || this.questions[questionId].response.address1.id !== this.originalQuestions[questionId].response.address1.id) {
                    return true;
                }
                if (this.questions[questionId].response.address2 === null) {
                    if (this.originalQuestions[questionId].response.address2 !== null) {
                        return true;
                    }
                } else if (this.originalQuestions[questionId].response.address2 === null || this.questions[questionId].response.address2.id !== this.originalQuestions[questionId].response.address2.id) {
                    return true;
                }
            }
        }
        // Check if any of the person data type question values have been modified
        if (this.config.hasOwnProperty('Person')) {
            for (let idx=0; idx < this.config.Person.length; idx++) {
                let questionId = this.config.Person[idx];
                if (this.questions[questionId].response === null) {
                    if (this.originalQuestions[questionId].response !== null) {
                        return true;
                    } else {
                        continue;
                    }
                } 
                if (this.originalQuestions[questionId].response === null) {
                    return true;
                }
                if (this.questions[questionId].response.address1 === null) {
                    if (this.originalQuestions[questionId].response.address1 !== null) {
                        return true;
                    }
                } else if (this.originalQuestions[questionId].response.address1 === null || this.questions[questionId].response.address1.storage_id !== this.originalQuestions[questionId].response.address1.storage_id) {
                    return true;
                }
                if (this.questions[questionId].address2 === null) {
                    if (this.originalQuestions[questionId].response.address2 !== null) {
                        return true;
                    }
                } else if (this.originalQuestions[questionId].response.address2 === null || this.questions[questionId].response.address2.storage_id !== this.originalQuestions[questionId].response.address2.storage_id) {
                    return true;
                }
                if (this.questions[questionId].response.storage_id !== this.originalQuestions[questionId].response.storage_id ||
                        this.questions[questionId].response.name.value !== this.originalQuestions[questionId].response.name.value ||
                        this.questions[questionId].response.gender.value !== this.originalQuestions[questionId].response.gender.value ||
                        this.questions[questionId].response.age.value !== this.originalQuestions[questionId].response.age.value ||
                        this.questions[questionId].response.phone.value !== this.originalQuestions[questionId].response.phone.value ||
                        this.questions[questionId].response.birthdate.value !== this.originalQuestions[questionId].response.birthdate.value ||
                        this.questions[questionId].response.nationality.value !== this.originalQuestions[questionId].response.nationality.value) {
                    return true;
                }
            }
        }
        return false;
    }
}

export default {
    BaseFormController
};
