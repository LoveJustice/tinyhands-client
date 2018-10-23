const CifOtherData = require('./cifOtherData.js');
const CifDateDate = require('./cifDateData.js');

class BaseModalController {
    constructor($uibModalInstance, $scope, isAdd, card, isViewing, modalActions, config) {
        'ngInject';
        let questions =  _.keyBy(card.responses, (x) => x.question_id);
        this.$uibModalInstance = $uibModalInstance;
        this.$scope = $scope;

        this.isAdd = isAdd;
        this.card = card;
        this.originalQuestions = questions;
        this.questions = angular.copy(questions);
        this.isViewing = isViewing;
        this.modalActions = modalActions;
        this.redFlagTotal = 0;
        this.config = config;
        
    	this.otherData = new CifOtherData(this.originalQuestions);
    	if (this.config.hasOwnProperty('RadioOther')) {
    		for (let idx=0; idx < this.config.RadioOther.length; idx++) {
    			let questionId = this.config.RadioOther[idx];
    			this.otherData.setRadioButton(this.config.RadioItems[questionId], questionId);
    		}
    	}
    
    	this.dateData = new CifDateDate(this.originalQuestions);
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
    	
    	this.setupFlagListener();
    }
    
    setupFlagListener() {
        this.$scope.$on('flagTotalCheck', (event, flagData) => {
            this.incrementRedFlags(flagData.numberOfFlagsToAdd);
        });
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