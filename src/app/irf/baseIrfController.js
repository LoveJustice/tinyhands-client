/* global angular */
/* global Image */
import {BaseFormController} from '../baseFormController.js';
import "./clocklet.less";
import clocklet from "clocklet";

export class BaseIrfController extends BaseFormController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService) {
        'ngInject';
        super($scope, $stateParams);

        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = IrfService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.relatedUrl = null;
        this.intercepteeImages = {};
        
        this.getIrf(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
    }
    
    // Override in sublcass to be triggered on complete retrieval of IRF
    getIrfComplete() {
    }
    
    dateAsUTC(inDateString) {
        let parts = inDateString.split("-");
        let year = Number(parts[0]);
        let month = Number(parts[1]) - 1;
        let date = Number(parts[2]);
        let utcDate = new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
        return utcDate;
    }
    
    dateAsString(inDate) {
        let dateString = '';
        dateString = inDate.getUTCFullYear() + '-';
        if (inDate.getUTCMonth() < 9) {
            dateString += '0';
        }
        dateString += (inDate.getUTCMonth()+1) + "-";
        if (inDate.getUTCDate() < 9) {
            dateString += '0';
        }
        dateString += inDate.getUTCDate();
        return dateString;
    }
    
    timeAs12Hour(inTime) {
        let outTime = '';
        let hour = Number(inTime.substr(0,2));
        if (hour === 0) {
            outTime = '12' + inTime.substr(2,3) + ' am';
        } else if (hour === 12) {
            outTime = inTime + ' pm';
        } else if (hour < 12) {
            outTime = inTime + ' am';
        } else {
            outTime = (hour - 12) + inTime.substr(2,3) + ' pm';
            if (hour < 22) {
                outTime = '0' + outTime;
            }
        }
        
        return outTime;
    }
    
    timeAs24Hour(inTime) {
        let outTime = '';
        let hour = Number(inTime.substr(0,2));
        if (inTime.substr(6,1) === 'a') {
            if (hour === 12) {
                outTime = '00' + inTime.substr(2,3);
            } else {
                outTime = inTime.substr(0,5);
            }
        } else {
            outTime = (hour + 12) + inTime.substr(2,3);
        }
        return outTime;
    }
    
    getIrf(countryId, stationId, id) {
    	this.service.getFormConfig(this.stateParams.formName).then ((response) => {
    		this.config = response.data;
    		this.service.getIrf(countryId, stationId, id).then((response) => {
    		    this.processResponse(response, id);
    		    if (this.stateParams.id !== null && this.questions[1].response.value !== null) {
    		        this.relatedUrl = this.state.href('relatedForms', {
    	                stationId: this.stateParams.stationId,
    	                formNumber: this.questions[1].response.value
    	            });
    		    }
    		    this.getIrfComplete();
    		    this.interceptionDate = null;
    		    this.clock = "";
    		    if (this.questions[4].response.value && this.questions[4].response.value.length > 9) {
    		        this.interceptionDate = this.dateAsUTC(this.questions[4].response.value.substr(0,10));
    		        if (this.questions[4].response.value.length > 15) {
    		            this.clock = this.timeAs12Hour(this.questions[4].response.value.substr(11,5));
    		        }
    		    }
            });
    	});
    }
    
    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }
    
    getScannedFormUrl(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }
    
    modalSave(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name, options) {
        if (theControllerName === 'IntercepteeModalController' && cardIndex !== null) {
            this.loadCanvas('intercepteeCanvas' + cardIndex, this.getResponseOfQuestionById(the_card.responses, 7).value);
        }
    }
    
    openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name, options={age:false}) {
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
                options: () => options,
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
    	            this.modalSave(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name, options);
                }
        	this.autoSaveModified = true;
        	this.autoSave();
        });
    }
    
    resizeImage(canvasName, img) {
        let maxSize = 150;
        let temp = angular.element('#' + canvasName);
        let canvas = temp.get(0);
        let ctx = canvas.getContext('2d');
        if (img.width > img.height) {
            canvas.width = maxSize;
            canvas.height = img.height * maxSize/img.width;
        } else {
            canvas.height = maxSize;
            canvas.width = img.width * maxSize/img.height;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    loadCanvas (canvasName,  questionValue){
        if (!questionValue) {
            return;
        }
        let imageUrl = null;
        let t = Object.prototype.toString.call(questionValue);
        if (t !== '[object String]') {
            imageUrl = questionValue.$ngfBlobUrl;
        } else {
            imageUrl = this.getIntercepteeImage(questionValue);
        }
        
        let img = new Image();
        img.src = imageUrl;
        this.intercepteeImages[canvasName] = img;
        img.addEventListener('load', (e)=>{/*jshint unused: false */
                for (let canvas in this.intercepteeImages) {
                    this.resizeImage(canvas, this.intercepteeImages[canvas]);
                }
            });
        
    }
    
    processInterceptionDate() {
        let dateTime = '';
        if (this.interceptionDate) {
            dateTime = this.dateAsString(this.interceptionDate);
            if (this.clock.length > 0) {
                dateTime += ' ' + this.timeAs24Hour(this.clock);
            }
        }
        
        this.questions[4].response.value = dateTime;
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
    	this.processInterceptionDate();
    	this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
    	this.service.submitIrf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
   		 this.response = response.data;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
            if (this.stateParams.id === null) {
           	 this.stateParams.id = response.data.id;
            }
            this.state.go('irfNewList');
        }, (error) => {
        	this.set_errors_and_warnings(error.data);
           });
    	 this.messagesEnabled = false;
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
    
    setFindings() {
        if (this.questions[814].response.value || !this.questions[4].response.value || this.questions[4].response.value.length < 10) {
            return;
        }
        let irfDate = new Date(this.questions[4].response.value);
        let cutoff = new Date(2020,2,1);
        if (irfDate < cutoff) {
            return;
        }
        if (this.redFlagTotal >= 10) {
            this.questions[607].response.value = "Clear Evidence of Trafficking";
        } else {
            this.questions[607].response.value = "High Risk of Trafficking";
        }
    }
    
    // Override in subclass for implementation specific features
    submitExtra() {
    }
    
    determineSubmitStatus() {
        let status = "approved";
        if (this.questions[819].response.value) {
            if (this.questions[819].response.value === 'Should Not have Intercepted or Should Not have Completed IRF (because there is Not a High Risk of Trafficking)') {
                status = "invalid";
            } else {
                status = 'second-verification';
            }
            if (!this.questions[821].response.value) {
                this.dateData.questions[821].value = new Date(); 
            }
            if (!this.questions[817].response.value) {
                this.dateData.questions[817].value = this.dateData.questions[821].value;
            }
        } else if (this.questions[814].response.value) {
            status = 'first-verification';
            if (!this.questions[817].response.value) {
                this.dateData.questions[817].value = new Date();
            }
        }
        return status;
    }

    submit() {
    	this.saved_status = this.response.status;
    	this.processPersons('Out');
    	this.questions[this.config.TotalFlagId].response.value = this.redFlagTotal;
    	this.response.status = this.determineSubmitStatus();
    	this.outCustomHandling();
    	this.submitExtra();
    	this.processInterceptionDate();
    	this.errorMessages = [];
        this.warningMessages = [];
    	if (this.ignoreWarnings) {
    		this.response.ignore_warnings = 'True';
    	} else {
    		this.response.ignore_warnings = 'False';
    	}
    	this.service.submitIrf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
    		 this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
            	 this.stateParams.id = response.data.id;
             }
             this.state.go('irfNewList');
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
        if (this.questions[1].response.value === null || this.questions[1].response.value === '' ||
                this.questions[4].response.value === null || this.questions[4].response.value === '') {
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
        this.spinner.show('Auto saving IRF...');
        this.service.submitIrf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
            this.stateParams.id = response.data.storage_id;
            this.processResponse(response, this.stateParams.id);
            if (this.stateParams.id !== null && this.questions[1].response.value !== null) {
                this.relatedUrl = this.state.href('relatedForms', {
                    stationId: this.stateParams.stationId,
                    formNumber: this.questions[1].response.value
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
	BaseIrfController
};
