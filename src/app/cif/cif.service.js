/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class CifService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getCif(countryId, stationId, id) {
    	if (id !== null) {
    		return this.service.get(`api/cif/${stationId}/${id}`);
    	} else {
    		return this.service.get(`api/cif/blank/${stationId}`);
    	}
    }
    
    removeTimeZoneAdjustment(cif) {
    	let dateTimeQuestions = [4];
    	for (let idx=0; idx < cif.responses.length; idx++) {
    		let t1 = dateTimeQuestions.indexOf(cif.responses[idx].question_id);
    		if (t1 > -1) {
    			let dt = cif.responses[idx].response.value;
	    		if (dt instanceof  Date) {
	    			let tzo = dt.getTimezoneOffset();
	    			dt.setMinutes(dt.getMinutes() - tzo);
	    		}
    		}
    	}
    }
    
    submitCif(stationId, id, cif) {
    	if (id === null) {
    		return this.postCif(cif);
    	} else {
    		return this.putCif(stationId, id, cif);
    	}
    }
    
    putCif(stationId, id, cif) {
    	let myCif = jQuery.extend(true, {}, cif);
    	let formData = new FormData();
    	this.removeTimeZoneAdjustment(myCif);
    	formData.append("main", JSON.stringify(myCif));
    	return this.service.put(`api/cif/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postCif(cif) {
    	let myCif = jQuery.extend(true, {}, cif);
    	let formData = new FormData();
    	this.removeTimeZoneAdjustment(myCif);  	
    	formData.append("main", JSON.stringify(myCif));
    	return this.service.post(`api/cif/`, formData, {'Content-Type': undefined});
    }
    
    getFormConfig(formName) {
        let url=`api/forms/config/${formName}/`;
        return this.service.get(url);
    }
    
    getAssociatedPersons(station_id, cif_number) {
        let url = `api/person/associated/${station_id}/${cif_number}/`;
        return this.service.get(url);
    }
}