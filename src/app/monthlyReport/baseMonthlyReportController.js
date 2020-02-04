import {BaseFormController} from '../baseFormController.js';

export class BaseMonthlyReportController extends BaseFormController {
    constructor($scope, $uibModal, constants, MonthlyReportService, $stateParams, $state, contexts, SpinnerOverlayService) {
        'ngInject';
        super($scope, $stateParams);
        
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = MonthlyReportService;
        this.state = $state;
        this.contexts = contexts;
        this.spinner = SpinnerOverlayService;
        
        this.contextPointQuestions = {
                "Governance":725,
                "Logistics & Registration":730,
                "Human Resources":738,
                "Awareness":748,
                "Security":757,
                "Accounting":764,
                "Victim Engagement":768,
                "Records":775,
                "Aftercare":789,
                "Paralegal":796,
                "Investigations":802
        };
        
        this.country_name = "";
        this.station_name = "";

        this.getMonthlyReport(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
        this.getStationInfo(this.stateParams.stationId);
    }
    
    getMonthlyReport(countryId, stationId, id) {
        this.service.getFormConfig(this.stateParams.formName).then ((response) => {
            this.config = response.data;
            this.service.getMonthlyReport(countryId, stationId, id).then((response) => {
                this.processResponse(response, id);
                if (id===null) {
                    let month = ["January", "February", "March", "April", "May", "June", "July", "August",
                                "September", "October", "November", "December"];
                    let date = new Date();
                    this.questions[714].response.value = date.getFullYear();
                    this.questions[715].response.value = month[date.getMonth()];
                }
            });
        });
    }
    
    getStationInfo (stationId) {
        this.service.getStation(stationId).then ((response) => {
            this.country_name = response.data.country_name;
            this.station_name = response.data.station_name;
            this.station_code = response.data.station_code;
        });
    }
    
    getAverageScore() {
        let total = 0;
        for (let contextIdx in this.contexts) {
            total += this.getContextCount(this.contexts[contextIdx]);
        }
        return Math.round(total/this.contexts.length * 10)/10;
    }
    
    savePoints() {
        this.questions[806].response.value = this.getAverageScore();
        for (let contextIdx in this.contexts) {
            let points = this.getContextCount(this.contexts[contextIdx]);
            let question_id = this.contextPointQuestions[this.contexts[contextIdx]];
            this.questions[question_id].response.value = points;
        }
    }
    
    openCommonModal(the_card, isAdd, cardIndex, theController, theControllerName, theTemplate, config_name) {
        let config = this.config[config_name];
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
            } else {
                if (isAdd) {
                    cards.push(the_card);
                }
            }
            this.autoSaveModified = true;
            this.autoSave();
        });
    }
    
    // Override in subclass for implementation specific features
    saveExtra() {   
    }
   
    save() {
        this.response.status = 'in-progress';
        this.savePoints();
        this.outCustomHandling();
        this.saveExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.service.submitMonthlyReport(this.stateParams.stationId, this.stateParams.id, this.response, this.station_code).then((response) => {
         this.response = response.data;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
            if (this.stateParams.id === null) {
             this.stateParams.id = response.data.id;
            }
            this.state.go('monthlyReportList');
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
        this.savePoints();
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
        this.service.submitMonthlyReport(this.stateParams.stationId, this.stateParams.id, this.response, this.station_code).then((response) => {
             this.response = response.data;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
                 this.stateParams.id = response.data.id;
             }
             this.state.go('monthlyReportList');
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
        return true;
    }
    
    doAutoSave() {
        this.response.status = 'in-progress';
        this.savePoints();
        this.outCustomHandling();
        this.saveExtra();
        this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
        this.spinner.show('Auto saving Monthly Report...');
        this.service.submitMonthlyReport(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
            this.stateParams.id = response.data.storage_id;
            this.processResponse(response, this.stateParams.id);
            this.spinner.hide();
        }, (error) => {
            this.set_errors_and_warnings(error.data);
            this.spinner.hide();
           });
         this.messagesEnabled = false;
    }
}

export default {
    BaseMonthlyReportController
};
