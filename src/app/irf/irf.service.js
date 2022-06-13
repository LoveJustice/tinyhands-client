/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class IrfService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.attachments = [
            {
                questions:[9],
                elementName:"images",
                includeFormNumber:true
            },
            {
                questions:[152,641],
                elementName:"scanned",
                includeFormNumber:true
            }
        ];
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
    
    getFormNumber(irf) {
        let response = '';
        for (let idx in irf.responses) {
            if (irf.responses[idx].question_id === 1) {
                response = irf.responses[idx].response.value;
                break;
            }
        }
        return response; 
}
    
    appendAttachments (formData, irf) {
        for (let attachIdx in this.attachments) {
            let formNumber = null;
            if (this.attachments[attachIdx].includeFormNumber) {
                formNumber = this.getFormNumber(irf);
            }
            let attachmentIdx  = 0;
            let questions = this.attachments[attachIdx].questions;
            let elementName = this.attachments[attachIdx].elementName;
            
            attachmentIdx = this.appendFiles(formData, irf.responses, formNumber, attachmentIdx, questions, elementName);
            
            for (let cardIdx in irf.cards) {
                for (let instanceIdx in irf.cards[cardIdx].instances) {
                    attachmentIdx = this.appendFiles(formData, irf.cards[cardIdx].instances[instanceIdx].responses, formNumber, attachmentIdx, questions, elementName);
                }
            }
        }
        
    }
    
    appendFiles(formData, responses, formNumber, startCnt, questions, elementName) {
        let cnt = startCnt;
        for (let idx=0; idx < responses.length; idx++) {
            if (questions.indexOf(responses[idx].question_id) > -1) {
                let value = null;
                if (responses[idx].response.hasOwnProperty('photo')) {
                    value = responses[idx].response.photo.value;
                } else {
                    value = responses[idx].response.value;
                }
                let t = Object.prototype.toString.call(value);
                let fileName = '';
                let prefix = '';
                if (formNumber !== null) {
                    prefix = formNumber + '_';
                }
                if (t === '[object Blob]') {
                    fileName = prefix + fileName + value.$ngfName;
                    formData.append(elementName + '[' + cnt + ']', value, fileName);
                    cnt += 1;
                } else if (t === '[object File]') {
                    fileName = prefix + fileName + value.name;
                    formData.append(elementName + '[' + cnt + ']', value, fileName);
                    cnt += 1;
                }
                
                if (fileName !== '') {
                    if (responses[idx].response.hasOwnProperty('photo')) {
                        responses[idx].response.photo.value = {'name': fileName};
                    } else {
                        responses[idx].response.value = {'name': fileName};
                    }
                }
            }
        }
        
        return cnt;
    }
    
    removeTimeZoneAdjustment(irf) {
    	let dateTimeQuestions = [4];
    	for (let idx=0; idx < irf.responses.length; idx++) {
    		let t1 = dateTimeQuestions.indexOf(irf.responses[idx].question_id);
    		if (t1 > -1) {
    			let dt = irf.responses[idx].response.value;
	    		if (dt instanceof  Date) {
	    		        let dtCopy = new Date(dt.getTime());
	    			let tzo = dt.getTimezoneOffset();
	    			dtCopy.setMinutes(dtCopy.getMinutes() - tzo);
	    			irf.responses[idx].response.value = dtCopy;
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
    	this.appendAttachments(formData, myIrf);
    	this.removeTimeZoneAdjustment(myIrf);
    	formData.append("main", JSON.stringify(myIrf));
    	return this.service.put(`api/irfNew/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postIrf(irf) {
    	let myIrf = jQuery.extend(true, {}, irf);
    	let formData = new FormData();
    	this.appendAttachments(formData, myIrf);
    	this.removeTimeZoneAdjustment(myIrf);	
    	formData.append("main", JSON.stringify(myIrf));
    	return this.service.post(`api/irfNew/`, formData, {'Content-Type': undefined});
    }
    
    getFormConfig(formName) {
    	let url=`api/forms/config/${formName}/`;
    	return this.service.get(url);
    }
    
    getLocation(stationId) {
        return this.service.get(`api/border-station/${stationId}/location/`);
    }
    
    sendDiagnostic(data) {
    	return this.service.post('api/diagnostic/', data);
    }
    
    getRelatedForms(stationId, formNumber) {
        return this.service.get(`api/forms/related/${stationId}/${formNumber}/`);
    }
    
    getAccount(id) {
        return this.service.get(`api/account/${id}/`);
    }
}