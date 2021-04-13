/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class LegalCaseService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = [1020];
    }
    
    getFormNumber(legalCase) {
        let response = '';
        for (let idx in legalCase.responses) {
            if (legalCase.responses[idx].question_id === 998) {
                response = legalCase.responses[idx].response.value;
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

    getLegalCase(countryId, stationId, id) {
        if (id !== null) {
            return this.service.get(`api/legal-case/${stationId}/${id}`);
        } else {
            return this.service.get(`api/legal-case/blank/${stationId}`);
        }
    }
    
    removeTimeZoneAdjustment(legalCase) {
        let dateTimeQuestions = [4];
        for (let idx=0; idx < legalCase.responses.length; idx++) {
            let t1 = dateTimeQuestions.indexOf(legalCase.responses[idx].question_id);
            if (t1 > -1) {
                let dt = legalCase.responses[idx].response.value;
                if (dt instanceof  Date) {
                    let tzo = dt.getTimezoneOffset();
                    dt.setMinutes(dt.getMinutes() - tzo);
                }
            }
        }
    }
    
    submitLegalCase(stationId, id, legalCase) {
        if (id === null) {
            return this.postLegalCase(legalCase);
        } else {
            return this.putLegalCase(stationId, id, legalCase);
        }
    }
    
    putLegalCase(stationId, id, legalCase) {
        let myLegalCase = jQuery.extend(true, {}, legalCase);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myLegalCase);
        this.appendScannedForm(formData, myLegalCase.responses, myLegalCase.cards, this.getFormNumber(myLegalCase));
        formData.append("main", JSON.stringify(myLegalCase));
        return this.service.put(`api/legal-case/${stationId}/${id}/`, formData, {'Content-Type': undefined});
    }
    
    postLegalCase(legalCase) {
        let myLegalCase = jQuery.extend(true, {}, legalCase);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myLegalCase);
        this.appendScannedForm(formData, myLegalCase.responses, myLegalCase.cards, this.getFormNumber(myLegalCase));
        formData.append("main", JSON.stringify(myLegalCase));
        return this.service.post(`api/legal-case/`, formData, {'Content-Type': undefined});
    }
    
    getFormConfig(formName) {
        let url=`api/forms/config/${formName}/`;
        return this.service.get(url);
    }
    
    getAssociatedPersons(station_id, legalCaseNumber) {
        let url = `api/person/associated/${station_id}/${legalCaseNumber}/`;
        return this.service.get(url);
    }
    
    getRelatedForms(stationId, formNumber) {
        return this.service.get(`api/forms/related/${stationId}/${formNumber}/`);
    }
    
    getLocation(stationId) {
        return this.service.get(`api/border-station/${stationId}/location/`);
    }
}