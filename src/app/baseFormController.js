/* global jQuery */
const OtherData = require('./otherData.js');
const DateData = require('./dateData.js');

const ID = 1;
const TAG = 2;

export class BaseFormController {
    constructor($scope, $stateParams, $uibModalStack) {
        'ngInject';
        this.$scope = $scope;
        this.stateParams = $stateParams;
        this.$uibModalStack = $uibModalStack;
        this.isViewing = this.stateParams.isViewing === 'true';
        this.stationId = this.stateParams.stationId;
        this.incidentService = null;
        
        $scope.$on('$destroy', function iVeBeenDismissed() {
            let ctrl = $scope.$ctrl;
            if (ctrl.$uibModalStack) {
                ctrl.$uibModalStack.dismissAll();
            }
          });

        this.response = {status:'in-progress'};
        this.relatedForms = {};
        this.ignoreWarnings = false;
        this.messagesEnabled = false;
        this.redFlagTotal = 0;
        this.flagContextCount = {};
        this.selectedStep = 0;
        this.autoSaveModified = false;
        this.lastAutoSave = null;
        this.maximumUploadSize = 99 * 1024 * 1024;
        this.maximumFileSize = 20 * 1024 * 1024;
        this.incidentNames = {
                address:{
                    forms:[],
                    locals:[]
                },
                pv:{
                    forms:[],
                    irfs:[],
                    locals:[]
                },
                suspect:{
                    forms:[],
                    irfs:[],
                    locals:[]
                }
            };
       
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
    
    processPersonIdentificationOut (ignore) {
    }
    
    processPersonResponses(responses, personConfigList, phase, ignore) {
        for (let idx in responses) {
            let identifier = responses[idx].question_id;
            if (this.config.useTags) {
                identifier = responses[idx].question_tag;
            }
            if (personConfigList.indexOf(identifier) > -1) {
                if (phase === 'In') {
                    this.processPersonIdentificationIn(responses[idx]);
                } else if (phase === 'Out') {
                    this.processPersonIdentificationOut(responses[idx]);
                }
            }
        }
    }
    
    processPersons(phase) {
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
    
    setupQuestions(responses) {
    	if (this.config.useTags) {
            this.questions = _.keyBy(responses, (x) => x.question_tag);
        } else {
            this.questions = _.keyBy(responses, (x) => x.question_id);
        }
    }
    

    processResponse(response, count_flags=true) {
        this.response = response.data;
        this.responses = response.data.responses;
        this.setupQuestions(this.responses);
        
        if (count_flags) {
            for (let idx=0; idx < this.response.cards.length; idx++) {
                for (let idx1=0; idx1 < this.response.cards[idx].instances.length; idx1++) {
                    this.redFlagTotal += this.response.cards[idx].instances[idx1].flag_count;
                }
            }
        }
        if (this.response.status === null || this.response.status === '' || this.response.status === 'pending') {
            this.response.status = 'in-progress';
        }

        // Copy response data for auto-save compare
        let originalResponse = jQuery.extend(true, {}, this.response);
        if (this.config.useTags) {
            this.originalQuestions = _.keyBy(originalResponse.responses, (x) => x.question_tag);
        } else {
            this.originalQuestions = _.keyBy(originalResponse.responses, (x) => x.question_id);
        }
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
    
    configIdentifier(value, idType) {
        if (idType === ID) {
            if (this.config.useTags) {
                return this.config.tagMap[value];
            } else {
                return value;
            }
        } else {
            if (this.config.useTags) {
                return value;
            } else {
                return null;
            }
        }
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
    
    getResponseOfQuestionByTag(responses, questionTag) {
        return _.find(responses, (x) => x.question_tag === questionTag).response;
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
                    if (this.config.useTags) {
                        if (card.responses[respIdx].question_tag === indexQuestion) {
                            value = card.responses[respIdx].response.value;
                            break;
                        }
                    } else {
                        if (card.responses[respIdx].question_id === indexQuestion) {
                            value = card.responses[respIdx].response.value;
                            break;
                        }
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
                    question_id: this.configIdentifier(config.Person[idx],ID),
                    question_tag: this.configIdentifier(config.Person[idx],TAG),
                    response: {
                        gender: {
                            value: ""
                        },
                        name: {},
                        age: {},
                        birthdate:{},
                        address: {},
                        address_notes: {},
                        phone: {},
                        nationality: {},
                        identifiers: {},
                        latitude: {},
                        longitude: {},
                        appearance: {},
                        arrested: {},
                        case_filed_against: {},
                        education: {},
                        guardian_name: {},
                        guardian_phone: {},
                        guardina_relationship: {},
                        occupation: {},
                        photo: {},
                        role: {},
                        social_media: {},
                        interviewer_believes: {},
                        pv_believes: {},
                    }
                });
            }
        }
        if (config.hasOwnProperty('Basic')) {
            for (let idx=0; idx < config.Basic.length; idx++) {
                if (config.Basic[idx] === indexQuestion) {
                    the_card.responses.push({
                            question_id: this.configIdentifier(config.Basic[idx], ID),
                            question_tag: this.configIdentifier(config.Basic[idx], TAG),
                            response: {value: lastIndex+1}});
                } else {
                    if (config.hasOwnProperty('FormDefault') && config.Basic[idx] in config.FormDefault) {
                        the_card.responses.push({
                                question_id: this.configIdentifier(config.Basic[idx], ID),
                                question_tag: this.configIdentifier(config.Basic[idx], TAG), 
                                response:config.FormDefault[config.Basic[idx]]});
                    } else {
                        the_card.responses.push({
                                question_id: this.configIdentifier(config.Basic[idx], ID),
                                question_tag: this.configIdentifier(config.Basic[idx], TAG),
                                response: {value:null}});
                    }
                }
            }
        }
        if (config.hasOwnProperty('Date')) {
            for (let idx=0; idx < config.Date.length; idx++) {
                the_card.responses.push({
                        question_id: this.configIdentifier(config.Date[idx], ID),
                        question_tag: this.configIdentifier(config.Date[idx], TAG),
                        response: {value:null}});
            }
        }
        if (config.hasOwnProperty('RadioOther')) {
            for (let idx=0; idx < config.RadioOther.length; idx++) {
                if (!(config.hasOwnProperty('Person') && config.Person.indexOf(config.RadioOther[idx]) > -1)) {
                    the_card.responses.push({
                            question_id: this.configIdentifier(config.RadioOther[idx], ID),
                            question_tag: this.configIdentifier(config.RadioOther[idx], TAG),
                            response: {value:null}});
                }
            }
        }
        return the_card;
    }
    
    getRelatedFormsComplete() {
    }
    
    getRelatedForms(service, session, stationId, formNumber) {
        this.service.getRelatedForms(stationId, formNumber).then((response) => {
            let relatedForms = response.data;
            this.relatedForms = {};
            for (let idx in relatedForms) {
                let url = null;
                if (this.session.checkPermission(relatedForms[idx].form_type,'EDIT',relatedForms[idx].country_id, stationId)) {
                    url = this.state.href(relatedForms[idx].form_name, {
                        id: relatedForms[idx].id,
                        stationId: relatedForms[idx].station_id,
                        countryId: relatedForms[idx].country_id,
                        isViewing: false,
                        formName: relatedForms[idx].form_name,
                    });
                } else if (this.session.checkPermission(relatedForms[idx].form_type,'VIEW',relatedForms[idx].country_id, stationId)) {
                    url = this.state.href(relatedForms[idx].form_name, {
                        id: relatedForms[idx].id,
                        stationId: relatedForms[idx].station_id,
                        countryId: relatedForms[idx].country_id,
                        isViewing: true,
                        formName: relatedForms[idx].form_name,
                    });
                } else {
                    continue;
                }
                if (!this.relatedForms[relatedForms[idx].form_type]) {
                    this.relatedForms[relatedForms[idx].form_type] = []; 
                }
                this.relatedForms[relatedForms[idx].form_type].push(
                        {
                            countryId:relatedForms[idx].country_id,
                            stationId:relatedForms[idx].station_id,
                            formName:relatedForms[idx].form_name,
                            id:relatedForms[idx].id,
                            formNumber: relatedForms[idx].form_number,
                            url: url
                        }
                );
            }
            this.getRelatedFormsComplete();
        });
    }
    
    excludeRelatedForm(formType, formNumber) {
        if (this.relatedForms[formType]) {
            for (let idx=0; idx < this.relatedForms[formType].length; idx++) {
                if (formNumber === this.relatedForms[formType][idx].formNumber) {
                    this.relatedForms[formType].splice(idx,1);
                }
            }
            if (this.relatedForms[formType].length < 1) {
                delete this.relatedForms[formType];
            }
        }
    }
    
    // Override in subclass for implementation specific features
    openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name) {
        /*jshint unused: false */
    }
    
    commonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name, options = {}) {
        let config = this.config[config_name];
        config.useTags = this.config.useTags;
        if (isAdd) {
            the_card = this.createCard(config_name);
        }
        
        if (config.hasOwnProperty('Person')) {
            for (let idx in the_card.responses) {
                let identifier = the_card.responses[idx].question_id;
                if (this.config.useTags) {
                    identifier = the_card.responses[idx].question_tag;
                }
                if (config.Person.indexOf(identifier) > -1) {
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
    
    getIncidentNumberFromFormNumber(formNumber) {
    	for (let idx=3; idx < formNumber.length; idx++) {
    		let letter = formNumber.charAt(idx);
    		if (letter !== '-' && (letter < '0' || letter > '9')) {
    			return formNumber.substring(0, idx);
    		}
    	}
    	return formNumber;
    }
    
    getIncidentNames(incidents) {
    	if (this.incidentService) {
    		 this.incidentService.getIncidentNames(incidents).then ((response) => {
    		 	this.incidentNames = response.data;
    		 }, (error) => {alert(error);});
    	}
    }
    
    // Overridden in subclass
    getUploadFileQuestions() {
        return [];
    }
    
    getResponseSize(response) {
        let imageObject = null;
        if (response.hasOwnProperty('photo')) {
            imageObject = response.photo.value;
        } else {
            imageObject = response.value;
        }
        
        return this.getUploadFileSize(imageObject);
    }
    
    gitUploadFilesSize(responses, startingSize) {
        let totalSize = startingSize;
        let fileQuestions = this.getUploadFileQuestions();
        for (let idx=0; idx < responses.length; idx++) {
            let identifier = responses[idx].question_id;
            if (this.config.useTags) {
                identifier = responses[idx].question_tag;
            }
            if (fileQuestions.indexOf(identifier) !== -1) {
                totalSize += this.getResponseSize(responses[idx].response);
            }
        }
        return totalSize;
    }
    
    getCurrentTotalUploadSize() {
        let totalSize = this.gitUploadFilesSize(this.response.responses, 0);
        for (let card in this.response.cards) {
            for (let instance in this.response.cards[card].instances) {
                totalSize = this.gitUploadFilesSize(this.response.cards[card].instances[instance].responses, totalSize);
            }
        }
        return totalSize;
    }
    
    getUploadFileSize(uploadObject) { 
        let t = Object.prototype.toString.call(uploadObject);
        let totalSize = 0;
        if (t === '[object Blob]') {
            totalSize += uploadObject.$ngfSize;
        } else if (t === '[object File]') {
            totalSize += uploadObject.size;
        }
        
        return totalSize;
    }
    
    willUploadExceedLimit(uploadObject) {
        let totalSize = this.getCurrentTotalUploadSize() + this.getUploadFileSize(uploadObject);
        return totalSize > this.maximumUploadSize;
    }
    
    doesUploadFileExceedLimit(uploadObject) {
        let totalSize = this.getUploadFileSize(uploadObject);
        return totalSize > this.maximumFileSize;
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
