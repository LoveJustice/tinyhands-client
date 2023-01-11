import {BaseFormController} from '../baseFormController.js';
import templateUrl from './incident.html';

export class IncidentController extends BaseFormController {
    constructor($scope, $stateParams, $state, $uibModalStack, SpinnerOverlayService, SessionService, IncidentService) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);

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
                let parts = this.incident.incident_date.split('-');
                if (parts.length === 3) {
                    this.incidentDate = new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
                }
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
