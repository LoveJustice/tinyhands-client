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

        this.getGospelVerification(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
        this.getVdf(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.vdf_id);
    }
    
    getGospelVerification(countryId, stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getGospelVerification(countryId, stationId, id).then((response) => {
                this.processResponse(response);
            }, (error) => {alert(error);});
        });
    }

    getVdf(countryId, stationId, id) {
        this.service.getVdf(countryId, stationId, id).then((response) => {
            this.vdfQuestions = _.keyBy(response.data.responses, (x) => x.question_id);
            this.vdfUrl = this.state.href(response.data.form_name, 
                    {   id:response.data.storage_id, 
                        stationId:response.data.station_id, 
                        countryId:response.data.country_id, 
                        isViewing:true,
                        formName: response.data.form_name});
        });
    }

    // Override in subclass for implementation specific features
    submitExtra() {
    }

    submit() {
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
