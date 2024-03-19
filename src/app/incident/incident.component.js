import {BaseFormController} from '../baseFormController.js';
import templateUrl from './incident.html';
import changeIncidentTemplate from './changeIncidentNumberModal.html';

class ChangeIncidentModalController {
	constructor($uibModalInstance, relatedForms, updateForms) {
		'ngInject';
		this.$uibModalInstance = $uibModalInstance;
		this.relatedForms = relatedForms;
		this.updateForms = updateForms;
		this.updateForms.existingIncident = this.relatedForms.Incident[0];
		this.updateForms.newIncidentNumber = '';
		this.updateForms.IRF = [];
		this.updateForms.PVF = [];
		this.updateForms.SF = [];
		this.updateForms.LF = [];
		this.updateForms.LEGAL_CASE = [];
		
		
		this.formTypes = ['IRF','PVF','SF','LF','LEGAL_CASE'];
		this.selected = {};
		
		for (let formTypeIndex in this.formTypes) {
			let formType = this.formTypes[formTypeIndex];
			if (this.relatedForms[formType]) {
				for (let entryIndex in this.relatedForms[formType]) {
					this.selected[formType + '|' + entryIndex] = true;
				}
			}
		}
	}
	
	validIncidentNumber() {
		let isValid = true;
		if (this.updateForms.newIncidentNumber.length < 6) {
			isValid = false;
		}
		else if (this.updateForms.existingIncident.formNumber.substring(0,3) !== this.updateForms.newIncidentNumber.substring(0,3)) {
			isValid = false;
		}
		return isValid;
	}
	
	cancel() {
        this.$uibModalInstance.dismiss();
    }
	
	submit() {
		for (let formTypeIndex in this.formTypes) {
			let formType = this.formTypes[formTypeIndex];
			if (this.relatedForms[formType]) {
				for (let entryIndex in this.relatedForms[formType]) {
					if (this.selected[formType + '|' + entryIndex]) {
						this.updateForms[formType].push(this.relatedForms[formType][entryIndex]);
					}
				}
			}
		}
		this.$uibModalInstance.close();
	}
}

export class IncidentController extends BaseFormController {
    constructor($scope, $stateParams, $state, $uibModal, $uibModalStack, SpinnerOverlayService, SessionService, IncidentService, toastr) {
        'ngInject';
        super($scope, $stateParams, $uibModalStack);

        this.state = $state;
        this.$uibModal = $uibModal;
        this.spinner = SpinnerOverlayService;
        this.session = SessionService;
        this.incidentService = IncidentService;
        this.toastr = toastr
        
        this.changeIncidentPermission = false;
        
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
    
    changeIncident() {
    	let relatedForms = this.relatedForms;
    	let updateForms = {};
        this.$uibModal.open({
            animation: true,
            templateUrl: changeIncidentTemplate,
            controller: ChangeIncidentModalController,
            size: 'lg',
            controllerAs: "vm",
            resolve: {
            	relatedForms() {return relatedForms;},
            	updateForms() {return updateForms;},
            },
        }).result.then(() => {
        	// send updates to server
        	this.incidentService.changeIncident(this.stateParams.id, updateForms).then((response) => {
        		this.getIncident(this.stateParams.id);
        	}, (error) => {
        		this.toastr.error(error.data.detail);
        	});
        });
    }
    
    getRelatedFormsComplete() {
    	let formTypes = ['IRF', 'PVF', 'SF', 'LF', 'LEGAL_CASE'];
    	let hasPermission = true;
    	let hasForms = false;
    	for (let formTypeIndex in formTypes) {
    		let formType = formTypes[formTypeIndex];
    		if (this.relatedForms[formType] && this.relatedForms[formType].length > 0) {
    			hasForms = true;
    			if (!this.session.checkPermission(formType,'ADD', this.incident.country_id,this.incident.station)) {
    				// If they do not have permission for any form on the incident, then they cannot change the incident
    				hasPermission = false;
    			}
    		}
    	}
    	this.changeIncidentPermission = hasForms && hasPermission;
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
