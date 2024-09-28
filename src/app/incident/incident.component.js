import {BaseFormController} from '../baseFormController.js';
import templateUrl from './incident.html';
const DateData = require('../dateData.js');

export class IncidentController extends BaseFormController {
    constructor($scope, $stateParams, $state, $uibModalStack, SpinnerOverlayService, SessionService, IncidentService, BaseUrlService) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack, BaseUrlService);

        this.state = $state;
        this.spinner = SpinnerOverlayService;
        this.session = SessionService;
        this.incidentService = IncidentService;
        
        this.getIncident(this.stateParams.id);
    }
    
    getIncident(id) {
        let theService = this.incidentService;
        theService.getIncident(id).then ((response) => {
            this.incident = response.data;
            if (this.incident.incident_date) {
                let dateData = new DateData([]);
                this.incidentDate = dateData.dateAsUTC(this.incident.incident_date);
            }
            this.getRelatedForms(theService, this.session, this.stateParams.stationId, this.incident.incident_number);
        });
    }
    
    getRelatedFormsComplete() {
    }
    

    submit() {
        this.incidentService.submitIncident(this.incident).then((response) => {
             this.incident = response.data;
         }, (error) => {
             alert(error);
            });
    }
}



export default {
    templateUrl,
    controller: IncidentController
};
