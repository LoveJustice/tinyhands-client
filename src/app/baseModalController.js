import OtherData from './otherData';
import DateData from './dateData';

/* global _ */
/* global setTimeout */

class BaseModalController {
    constructor($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config, constants, parentController) {
        'ngInject';
        let questions = {};
        if (config.useTags) {
            questions = _.keyBy(card.responses, (x) => x.question_tag);
        } else {
            questions = _.keyBy(card.responses, (x) => x.question_id);
        }
        this.$uibModalInstance = $uibModalInstance;
        this.$scope = $scope;

        this.isAdd = isAdd;
        this.card = card;
        this.originalQuestions = questions;
        this.questions = {};
        this.isViewing = isViewing;
        this.modalActions = modalActions;
        this.redFlagTotal = 0;
        this.config = config;
        this.constants = constants;
        this.parentController = parentController;
        this.otherData = null;
        this.dateData = null;	
    	
    	this.setupFlagListener();
    	// Delay the setting of question data.  This allows the components to be initialized
    	// without data.  Whe flagged questions are then initialized, the flag listener will be
    	// notified to increment the flags.
    	setTimeout ( () => {this.baseDelayedQuestionData();}, 500 );
    }
    
    // override in subclass to set additional delayed data.
    delayedQuestionData() {
    }
    
    baseDelayedQuestionData() {
        this.questions = _.cloneDeep(this.originalQuestions);
        
        this.otherData = new OtherData(this.originalQuestions);
        if (this.config.hasOwnProperty('RadioOther')) {
            for (let property in this.config.RadioItems) {
                let parts = ('' + property).split('-');
                let searchValue = null;
                if (this.config.useTags) {
            		searchValue = parts[0];
            	} else {
            		searchValue = Number(parts[0]);
            	}
                if (parts.length === 1 && this.config.RadioOther.indexOf(searchValue) >= 0 ||
                        parts.length === 2 && this.config.RadioOther.indexOf(searchValue) >= 0) {
                    this.otherData.setRadioButton(this.config.RadioItems[property], property);
                }
            }
        }
    
        this.dateData = new DateDate(this.originalQuestions);
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
        this.delayedQuestionData();
        
        // Cause AngularJS to notice that the data has been updated in the modal.
        this.$scope.$digest();
    }
    
    setupFlagListener() {
        this.$scope.$on('flagTotalCheck', (event, flagData) => {
            this.incrementRedFlags(flagData.numberOfFlagsToAdd);
        });
    }
    
    checkUploadSize(response) {
        if (this.parentController.doesUploadFileExceedLimit(response.value)) {
            alert('The size of this photo/attachment is is greater than the maximum allowed size');
            response.value = null;
        } else if (this.parentController.willUploadExceedLimit(response.value)){
            alert ('Adding this photo/attachment to those photos and attachments already being added would exceed the upload limit.  ' +
                    'Please save or submit the form to upload the photos and attachments that were already added.  ' +
                    'Then you may reopen the form to add the photo/attachment.');
            response.value = null;
        }
    }

    
    close() {
        this.$uibModalInstance.close();
    }

    dismiss() {
        this.$uibModalInstance.dismiss();
    }
    
    delete() {
    	this.modalActions.push('removeCard');
        this.$uibModalInstance.close();
    }
    
    saveQuestions(questionList) {
    	for (let idx=0; idx < questionList.length; idx++) {
    		this.originalQuestions[questionList[idx]].response = this.questions[questionList[idx]].response;
    	}
    }
    
    incrementRedFlags(numberOfFlagsToAdd) {
        this.redFlagTotal += numberOfFlagsToAdd;
    }
    
    getScannedFormUrl(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }
    
    isString(val) {
        return typeof val === 'string';
    }
    
    subclassSave() { 	
    }

    save() {
    	if (this.config.hasOwnProperty('Person')) {
    		this.saveQuestions(this.config.Person);
    	}
    	if (this.config.hasOwnProperty('Address')) {
    		this.saveQuestions(this.config.Address);
    	}
    	if (this.config.hasOwnProperty('Basic')) {
    		this.saveQuestions(this.config.Basic);
    	}
    	this.dateData.updateResponses();
    	this.otherData.updateResponses();
    	
    	this.subclassSave();
    	
    	this.card.flag_count = this.redFlagTotal;

        this.close();
    }
}

export {BaseModalController};