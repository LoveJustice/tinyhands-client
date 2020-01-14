/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class CifService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = [612];
    }
    
    getFormNumber(cif) {
        let response = '';
        for (let idx in cif.responses) {
            if (cif.responses[idx].question_id === 287) {
                response = cif.responses[idx].response.value;
                break;
            }
        }
        return response; 
    }
    
    appendScannedForm(formData, responses, cards, formNumber) {
        this.appendScannedFiles(formData, responses, formNumber);
        let attachmentIdx = 0;
        for (let card in cards) {
            for (let instance in cards[card].instances) {
                attachmentIdx = this.appendScannedFiles(formData, cards[card].instances[instance].responses, formNumber, attachmentIdx);
            }
        }
    }
    
    appendScannedFiles(formData, responses, formNumber, startingIndex) {
        let cnt = startingIndex;
        for (let idx=0; idx < responses.length; idx++) {
            if (this.file_questions.indexOf(responses[idx].question_id) !== -1) {
                let t = Object.prototype.toString.call(responses[idx].response.value);
                if (t === '[object Blob]') {
                    let fileName = formNumber + '_' + responses[idx].response.value.$ngfName;
                    formData.append('scanned[' + cnt + ']', responses[idx].response.value, fileName);
                    responses[idx].response.value = {'name': fileName};
                    cnt += 1;
                } else if (t === '[object File]') {
                    let fileName = formNumber + '_' + responses[idx].response.value.name;
                    formData.append('scanned[' + cnt + ']', responses[idx].response.value, fileName);
                    responses[idx].response.value = {'name': fileName};
                    cnt += 1;
                }
            }
        }
        return cnt;
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
    	this.appendScannedForm(formData, myCif.responses, myCif.cards, this.getFormNumber(myCif));
    	formData.append("main", JSON.stringify(myCif));
    	return this.service.put(`api/cif/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postCif(cif) {
    	let myCif = jQuery.extend(true, {}, cif);
    	let formData = new FormData();
    	this.removeTimeZoneAdjustment(myCif);
    	this.appendScannedForm(formData, myCif.responses, myCif.cards, this.getFormNumber(myCif));
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
    
    getRelatedForms(stationId, formNumber) {
        return this.service.get(`api/forms/related/${stationId}/${formNumber}/`);
    }
}