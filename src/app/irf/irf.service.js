/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class IrfService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getIrf(countryId, stationId, id) {
    	if (id !== null) {
    		return this.service.get(`api/irfNew/${stationId}/${id}`);
    	} else {
    		return this.service.get(`api/irfNew/blank/${stationId}`);
    	}
    }

    appendImages(formData, card_instances) {
    	let cnt=0;
    	for (let idx=0; idx < card_instances.length; idx++) {
    		for (let r_idx=0; r_idx < card_instances[idx].responses.length; r_idx++) {
    			let t = Object.prototype.toString.call(card_instances[idx].responses[r_idx].response.value);
    			if (t === '[object Blob]') {
    				formData.append('images[' + cnt + ']', card_instances[idx].responses[r_idx].response.value, card_instances[idx].responses[r_idx].response.value.$ngfName);
    				card_instances[idx].responses[r_idx].response.value = {'name': card_instances[idx].responses[r_idx].response.value.$ngfName};
    				cnt += 1;
    			} else if (t === '[object File]') {
    				formData.append('images[' + cnt + ']', card_instances[idx].responses[r_idx].response.value, card_instances[idx].responses[r_idx].response.value.name);
    				card_instances[idx].responses[r_idx].response.value = {'name': card_instances[idx].responses[r_idx].response.value.name};
    				cnt += 1;
    			}
    		}
    	}
    }
    
    appendScannedForm(formData, responses) {
    	let cnt = 0;
    	for (let idx=0; idx < responses.length; idx++) {
    		if (responses[idx].question_id === 152) {
    			let t = Object.prototype.toString.call(responses[idx].response.value);
    			if (t === '[object Blob]') {
    				formData.append('scanned[' + cnt + ']', responses[idx].response.value, responses[idx].response.value.$ngfName);
    				responses[idx].response.value = {'name': responses[idx].response.value.$ngfName};
    				cnt += 1;
    			} else if (t === '[object File]') {
    				formData.append('scanned[' + cnt + ']', responses[idx].response.value, responses[idx].response.value.name);
    				responses[idx].response.value = {'name': responses[idx].response.value.name};
    				cnt += 1;
    			}
    		}
    	}
    }
    
    removeTimeZoneAdjustment(irf) {
    	let dateTimeQuestions = [4];
    	for (let idx=0; idx < irf.responses.length; idx++) {
    		let t1 = dateTimeQuestions.indexOf(irf.responses[idx].question_id);
    		if (t1 > -1) {
    			let dt = irf.responses[idx].response.value;
	    		if (dt instanceof  Date) {
	    			let tzo = dt.getTimezoneOffset();
	    			dt.setMinutes(dt.getMinutes() - tzo);
	    		}
    		}
    	}
    }
    
    submitIrf(stationId, id, irf) {
    	if (id === null) {
    		return this.postIrf(irf);
    	} else {
    		return this.putIrf(stationId, id, irf);
    	}
    }
    
    putIrf(stationId, id, irf) {
    	let myIrf = jQuery.extend(true, {}, irf);
    	let formData = new FormData();
    	this.appendImages(formData, myIrf.cards[0].instances);
    	this.removeTimeZoneAdjustment(myIrf);
    	this.appendScannedForm(formData, myIrf.responses);
    	formData.append("main", JSON.stringify(myIrf));
    	return this.service.put(`api/irfNew/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postIrf(irf) {
    	let myIrf = jQuery.extend(true, {}, irf);
    	let formData = new FormData();
    	this.appendImages(formData, myIrf.cards[0].instances);
    	this.removeTimeZoneAdjustment(myIrf);
    	this.appendScannedForm(formData, myIrf.responses);  	
    	formData.append("main", JSON.stringify(myIrf));
    	return this.service.post(`api/irfNew/`, formData, {'Content-Type': undefined});
    }
    
    getFormConfig(formName) {
    	let url=`api/forms/config/${formName}/`;
    	return this.service.get(url);
    }
}