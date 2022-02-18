/* global angular */
/* global Image */
import {BaseFormController} from '../baseFormController.js';

export class BaseIrfController extends BaseFormController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);

        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = IrfService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.session = SessionService;
        this.relatedUrl = null;
        this.intercepteeImages = {};
        this.formNumberPattern = '';
        this.locations = [];
        this.restrictChanges = false;
        
        this.includeQuestion = {};
        
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
        if (inDate.getUTCDate() <= 9) {
            dateString += '0';
        }
        dateString += inDate.getUTCDate();
        return dateString;
    }
    
    timeAsUTC(inTime) {
        let parts = inTime.split(":");
        let outTime = new Date(0);
        outTime.setUTCHours(Number(parts[0]));
        outTime.setUTCMinutes(Number(parts[1]));
        
        return outTime;
    }
    
    timeAsString(inTime) {
        let outTime = '';
        let hour = inTime.getUTCHours();
        if (hour < 10) {
            outTime = '0' + hour + ':';
        } else {
            outTime = hour + ':';
        }
        let minute = inTime.getUTCMinutes();
        if (minute < 10) {
            outTime += '0' + minute;
        } else {
            outTime += minute;
        }
        return outTime;
    }
    
    formNumberChange() {
        this.goodFormNumber = (this.questions[1].response.value.match(this.formNumberPattern) !== null);
        if (this.goodFormNumber) {
            this.getRelatedForms(this.service, this.session, this.stateParams.stationId, this.questions[1].response.value);
        }
    }
    
    getRelatedFormsComplete() {
        this.excludeRelatedForm('IRF', this.questions[1].response.value);
    }
    
    getLocations(stationId) {
        this.service.getLocation(stationId).then ((response) => {
            this.locations = response.data.map((x) => x.name);
            this.otherData.setRadioButton(this.locations, 3);
        });
    }
    
    getIrf(countryId, stationId, id) {
    	this.service.getFormConfig(this.stateParams.formName).then ((response) => {
    		this.config = response.data;
    		this.service.getIrf(countryId, stationId, id).then((response) => {
    		    this.processResponse(response, id);
    		    this.restrictChanges = this.response.status === 'second-verification' || this.response.status === 'approved' && !this.questions[607].response.value;
    		    if (this.stateParams.id !== null && this.questions[1].response.value !== null) {
    		        this.relatedUrl = this.state.href('relatedForms', {
    	                stationId: this.stateParams.stationId,
    	                formNumber: this.questions[1].response.value
    	            });
    		    }
    		    if (this.questions[1].response.value === null || this.questions[1].response.value === '') {
    		        this.questions[1].response.value = this.response.station_code;
    		    }
    		    this.getIrfComplete();
    		    this.interceptionDate = null;
    		    this.clock = null;
    		    if (this.questions[1067].response.value && this.questions[1067].response.value.length > 4) {
    		        this.clock = this.timeAsUTC(this.questions[1067].response.value);
    		    }
    		    this.formNumberPattern = '^' + this.response.station_code + '[0-9]{3,}$';
    		    this.formNumberChange();
    	            this.getLocations(this.stationId);
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
        /*jshint unused: false */
        if (theControllerName === 'IntercepteeModalController' && cardIndex !== null) {
            this.loadCanvas('intercepteeCanvas' + cardIndex, this.getResponseOfQuestionById(the_card.responses, 9).photo.value);
        }
    }
    
    openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name, options={age:false}) {
    	let config = this.config[config_name];

    	let starting_flag_count = the_card.flag_count;
    	this.modalActions = [];
    	options.restrictChanges  = this.restrictChanges;
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
        if (canvas.width && canvas.height) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
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
        this.intercepteeImages[canvasName] = img;
        img.addEventListener('load', (e)=>{/*jshint unused: false */
                for (let canvas in this.intercepteeImages) {
                    this.resizeImage(canvas, this.intercepteeImages[canvas]);
                }
            });
        img.src = imageUrl;
       
        
    }
    
    getUploadFileQuestions() {
        return [9, 641];
    }
    
    processInterceptionDate() {
        let theTime = null;
        if (this.clock !== null) {
            theTime = this.timeAsString(this.clock);
        }
        
        this.questions[1067].response.value = theTime;
    }
    
    processFailedResponse(response, location) {
    	if (response.data.errors) {
            if (response.data.errors instanceof Array) {
                this.errorMessages = response.data.errors;
            } else {
                this.errorMessages = [response.data.errors];
            }
        } else {
            this.errorMessages = [];
        }
        if (response.data.warnings) {
            if (response.data.warnings instanceof Array) {
                this.warningMessages = response.data.warnings;
            } else {
                this.warningMessages = [response.data.warnings];
            }
        } else {
            this.warningMessages = [];
        }
    	if (this.errorMessages.length === 0 && this.warningMessages.length === 0) {
    		let diagnostic = JSON.stringify(response, null, 0).replace(/\\n/g,'');
    		
    		this.errorMessages = ['Unexpected Error:', diagnostic];
    		let diagnosticStructure = {
    			user_name:this.session.user.first_name + ' ' + this.session.user.last_name,
    			location:location,
    			diagnostic_data:diagnostic
    		};
    		this.service.sendDiagnostic(diagnosticStructure);
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
        	this.processFailedResponse(error, 'baseIrfController.save');
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
        if ((this.questions[814].response.value && this.questions[607].response.value) || !this.questions[1066].response.value || this.questions[1066].response.value.length < 10) {
            return;
        }
        let irfDate = new Date(this.questions[1066].response.value);
        let cutoff = new Date(2020,2,1);
        if (irfDate < cutoff) {
            return;
        }
        if (this.redFlagTotal >= 10) {
            this.questions[607].response.value = "Evidence of Trafficking";
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
                this.questions[1026].response.value = this.session.user.first_name + ' ' + this.session.user.last_name;
            }
            if (!this.questions[817].response.value) {
                this.dateData.questions[817].value = this.dateData.questions[821].value;
            }
        } else if (this.questions[814].response.value) {
            status = 'first-verification';
            if (!this.questions[817].response.value) {
                this.dateData.questions[817].value = new Date();
                this.questions[1025].response.value = this.session.user.first_name + ' ' + this.session.user.last_name;
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
    	this.processInterceptionDate();
    	this.submitExtra();
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
        	 this.processFailedResponse(error, 'baseIrfController.submit');
        	 this.response.status = this.saved_status;
            });
    	
        this.messagesEnabled = true;
    }

    autoSaveInterval() {
        return 30000;
    }

    autoSaveHasMinimumData() {
        if (this.questions[1].response.value === null || this.questions[1].response.value === '' ||
                this.questions[1066].response.value === null || this.questions[1066].response.value === '') {
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
                this.processFailedResponse(error, 'baseIrfController.doAutoSave');
                this.spinner.hide();
           });
         this.messagesEnabled = false;
    }
}

export default {
	BaseIrfController
};
