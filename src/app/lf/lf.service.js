/*global FormData */
/* global jQuery */
export default class LfService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = ['lfAttachmentAttachment'];
    }
    
    getFormNumber(lf) {
        let response = '';
        for (let idx in lf.responses) {
            if (lf.responses[idx].question_tag === 'lfTopLfNumber') {
                response = lf.responses[idx].response.value;
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

    getLf(countryId, stationId, id) {
        if (id !== null) {
            return this.service.get(`api/lf/${stationId}/${id}`);
        } else {
            return this.service.get(`api/lf/blank/${stationId}`);
        }
    }
    
    removeTimeZoneAdjustment(lf) {
        let dateTimeQuestions = [4];
        for (let idx=0; idx < lf.responses.length; idx++) {
            let t1 = dateTimeQuestions.indexOf(lf.responses[idx].question_tag);
            if (t1 > -1) {
                let dt = lf.responses[idx].response.value;
                if (dt instanceof  Date) {
                    let tzo = dt.getTimezoneOffset();
                    dt.setMinutes(dt.getMinutes() - tzo);
                }
            }
        }
    }
    
    submitLf(stationId, id, lf) {
        if (id === null) {
            return this.postLf(lf);
        } else {
            return this.putLf(stationId, id, lf);
        }
    }
    
    putLf(stationId, id, lf) {
        let myLf = jQuery.extend(true, {}, lf);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myLf);
        this.appendScannedForm(formData, myLf.responses, myLf.cards, this.getFormNumber(myLf));
        formData.append("main", JSON.stringify(myLf));
        return this.service.put(`api/lf/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postLf(lf) {
        let myLf = jQuery.extend(true, {}, lf);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myLf);
        this.appendScannedForm(formData, myLf.responses, myLf.cards, this.getFormNumber(myLf));
        formData.append("main", JSON.stringify(myLf));
        return this.service.post(`api/lf/`, formData, {'Content-Type': undefined});
    }
    
    getFormConfig(formName) {
        let url=`api/forms/config/${formName}/?identifier=tag`;
        return this.service.get(url);
    }
    
    getAssociatedPersons(station_id, lfNumber) {
        let url = `api/person/associated/${station_id}/${lfNumber}/`;
        return this.service.get(url);
    }
    
    getRelatedForms(stationId, formNumber) {
        return this.service.get(`api/forms/related/${stationId}/${formNumber}/`);
    }
    
    getAssociatedIncidents(id) {
    	return this.service.get(`api/lf/associated/${id}`);
    }
    
    setAssociatedIncidents(id, incidentIds) {
    	return this.service.put(`api/lf/associated/${id}`, incidentIds);
    }
}