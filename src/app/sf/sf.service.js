/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class SfService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = ['sfAttachmentAttachment'];
    }
    
    getFormNumber(sf) {
        let response = '';
        for (let idx in sf.responses) {
            if (sf.responses[idx].question_tag === 'sfTopSfNumber') {
                response = sf.responses[idx].response.value;
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
            if (this.file_questions.indexOf(responses[idx].question_tag) !== -1) {
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

    getSf(countryId, stationId, id) {
        if (id !== null) {
            return this.service.get(`api/sf/${stationId}/${id}`);
        } else {
            return this.service.get(`api/sf/blank/${stationId}`);
        }
    }
    
    removeTimeZoneAdjustment(sf) {
        let dateTimeQuestions = [4];
        for (let idx=0; idx < sf.responses.length; idx++) {
            let t1 = dateTimeQuestions.indexOf(sf.responses[idx].question_tag);
            if (t1 > -1) {
                let dt = sf.responses[idx].response.value;
                if (dt instanceof  Date) {
                    let tzo = dt.getTimezoneOffset();
                    dt.setMinutes(dt.getMinutes() - tzo);
                }
            }
        }
    }
    
    submitSf(stationId, id, sf) {
        if (id === null) {
            return this.postSf(sf);
        } else {
            return this.putSf(stationId, id, sf);
        }
    }
    
    putSf(stationId, id, sf) {
        let mySf = jQuery.extend(true, {}, sf);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(mySf);
        this.appendScannedForm(formData, mySf.responses, mySf.cards, this.getFormNumber(mySf));
        formData.append("main", JSON.stringify(mySf));
        return this.service.put(`api/sf/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postSf(sf) {
        let mySf = jQuery.extend(true, {}, sf);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(mySf);
        this.appendScannedForm(formData, mySf.responses, mySf.cards, this.getFormNumber(mySf));
        formData.append("main", JSON.stringify(mySf));
        return this.service.post(`api/sf/`, formData, {'Content-Type': undefined});
    }
    
    getFormConfig(formName) {
        let url=`api/forms/config/${formName}/?identifier=tag`;
        return this.service.get(url);
    }
    
    getAssociatedPersons(station_id, sfNumber) {
        let url = `api/person/associated/${station_id}/${sfNumber}/`;
        return this.service.get(url);
    }
    
    getRelatedForms(stationId, formNumber) {
        return this.service.get(`api/forms/related/${stationId}/${formNumber}/`);
    }
    
    getAssociatedIncidents(id) {
    	return this.service.get(`api/sf/associated/${id}`);
    }
    
    setAssociatedIncidents(id, incidentIds) {
    	return this.service.put(`api/sf/associated/${id}`, incidentIds);
    }
}