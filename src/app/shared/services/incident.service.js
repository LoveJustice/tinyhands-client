export default class IncidentService {
    constructor(BaseService) {
        'ngInject';

        this.service = BaseService;
    }
    
    
    getIncident(id) {
    	return this.service.get(`api/incident/${id}/`);
    }
    
    submitInstance(incident) {
    	if (incident.id === null) {
    		return this.postIncident(incident);
    	} else {
    		return this.putIncident(id, incident);
    	}
    }
    
    searchIncident(incidentNumber) {
    	return this.service.get(`api/incident/?search=${incidentNumber}`);
    }
    
    putIncident(incident) {
    	return this.service.put(`api/incident/${incident.id}/`, incident);
    }
    
    postIncident(incident) {
    	return this.service.post(`api/incident/`, incident);
    }
    
    getIncidentNames(incidentNumbers) {
    	let incidentString = '';
    	let sep = '';
    	for (let idx in incidentNumbers) {
    		incidentString += sep + incidentNumbers[0];
    		sep = ',';
    	}
    	return this.service.get(`api/incident/names/?number=${incidentString}`);
    }
}