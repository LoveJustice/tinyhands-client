/* global alert */
import {BaseFormController} from '../baseFormController.js';

export class BaseGospelVerificationController extends BaseFormController {
    constructor($scope, GospelVerificationService, VdfService, $stateParams, $state, SpinnerOverlayService, $uibModalStack, SessionService) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);
        
        this.service = GospelVerificationService;
        this.vdfService = VdfService;
        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.session = SessionService;

        // 0: vdf, 1: pvf
        this.formType = null;
        this.questionIdDict = {
            "heardGospel": [675, 'pvfAwarenessHeardMessage'],
            "believeNow": [676, 'pvfAwarenessWhatBelieveNow'],
            "interviewer": [6, 'pvfTopInterviewer'],
            "formNumber": [651, 'pvfTopPvfNumber'],
            "interviewDate": [288, 'pvfTopInterviewDate'],
            "pv": [653, 'pvfPvInfoPv'],
        };
        this.getGospelVerification(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
        this.getForm(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.vdf_id);
    }

    parseFormResponse(response){
        this.form = response.data;
        if (this.formType == 0) {
        	this.formQuestions = _.keyBy(response.data.responses, (x) => x.question_id);
        } else {
        	this.formQuestions = _.keyBy(response.data.responses, (x) => x.question_tag);
        }
        this.origForm = {
            "heardGospel":this.formQuestions[this.questionIdDict.heardGospel[this.formType]].response.value,
            "believeNow":this.formQuestions[this.questionIdDict.believeNow[this.formType]].response.value
        };
    }

    getForm(countryId, stationId, formId) {
        this.service.getVdf(countryId, stationId, formId).then((response) => {
            this.formType = 0;
            this.parseFormResponse(response);
        }, (error) => {
            this.formType = 1;
            this.service.getPvf(countryId, stationId, formId).then((response) => {
                this.formType = 1;
                this.parseFormResponse(response);
            });
        });
    }


    getGospelVerification(countryId, stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getGospelVerification(countryId, stationId, id).then((response) => {
                this.processResponse(response);
            }, (error) => {alert(error);});
        });
    }

    updateChangeRequired() {
        if (this.questions[1060].response.value === 'Yes') {
            this.questions[1062].response.value = null;
            this.questions[1063].response.value = null;
            this.questions[1064].response.value = null;
            this.questions[1065].response.value = null;
        } else if (this.questions[1060].response.value === 'No') {
            this.questions[1061].response.value = null;
            this.formQuestions[this.questionIdDict.believeNow[this.formType]].response.value = 'Came to believe that Jesus is the one true God';
        }
    }
    
    isFormComplete() {
    	let formComplete = false;
    	if (this.questions[1060].response.value === 'Yes') {
    		formComplete = this.formQuestions[this.questionIdDict.believeNow[this.formType]].response.value &&
    				this.questions[1061].response.value;
    	} else if (this.questions[1060].response.value === 'No') {
    		formComplete = this.questions[1062].response.value &&
    				this.questions[1063].response.value &&
    				this.questions[1064].response.value &&
    				this.questions[1065].response.value;
    	}
        return formComplete;
    }

    // Override in subclass for implementation specific features
    submitExtra() {
    }

    submit() {
        if (this.origForm.believeNow[this.formType] !== this.formQuestions[this.questionIdDict.believeNow[this.formType]].response.value) {
            this.service.updateGospelVdf(this.stateParams.vdf_id, this.formQuestions[this.questionIdDict.believeNow[this.formType]].response.value).then(
                    () => {
                    }, ()=>{
                        alert("Failed to update PVF");
                    }); 
        }
        if (!this.questions[1034].response.value) {
            this.questions[1034].response.value = this.session.user.first_name + ' ' + this.session.user.last_name;
        }
        if (!this.questions[1033].response.value) {
            this.dateData.questions[1033].value = new Date();
        }
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
        this.service.submitGospelVerification(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
             this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
                 this.stateParams.id = response.data.id;
             }
             this.state.go('gospelVerificationList');
         }, (error) => {
             this.set_errors_and_warnings(error.data);
            });
        
        this.messagesEnabled = true;
    }
}

export default {
    BaseGospelVerificationController
};
