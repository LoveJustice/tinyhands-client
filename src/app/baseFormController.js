const OtherData = require('./otherData.js');
const DateData = require('./dateData.js');
const PersonIdentifierChoice = require('./personIdentifierChoice.js');

export class BaseFormController {
    constructor($scope, $stateParams) {
        'ngInject';
        this.$scope = $scope;
        this.stateParams = $stateParams;
        this.isViewing = this.stateParams.isViewing === 'true';
        this.stationId = this.stateParams.stationId;

        this.response = {status:'in-progress'};
        this.ignoreWarnings = false;
        this.messagesEnabled = false;
        this.redFlagTotal = 0;
        this.selectedStep = 0;
       
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
    
    processResponse(response, id) {
        this.response = response.data;
        this.responses = response.data.responses;
        this.questions = _.keyBy(this.responses, (x) => x.question_id);
        for (let idx=0; idx < this.response.cards.length; idx++) {
            for (let idx1=0; idx1 < this.response.cards[idx].instances.length; idx1++) {
                this.redFlagTotal += this.response.cards[idx].instances[idx1].flag_count;
            }
        }
        
        this.processPersons('In');
        this.inCustomHandling();
        if (id === null) {
            this.response.status = 'in-progress';
        }
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

    incrementRedFlags(numberOfFlagsToAdd) {
        this.redFlagTotal += numberOfFlagsToAdd;
    }
    
    // Override in subclass for implementation specific features
    openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name) {
        /*jshint unused: false */
    }
    
    commonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name) {
        let config = this.config[config_name];
        if (isAdd) {
            the_card = {
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
                    the_card.responses.push({question_id: config.RadioOther[idx], response: {value:null}});
                }
            }
        }
        
        if (config.hasOwnProperty('Person')) {
            for (let idx in the_card.responses) {
                if (config.Person.indexOf(the_card.responses[idx].question_id) > -1) {
                    this.processPersonIdentificationIn(the_card.responses[idx]);
                }
            }
        }
        
        this.openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name);
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
            this.incrementRedFlags(flagData.numberOfFlagsToAdd);
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
}

export default {
    BaseFormController
};
