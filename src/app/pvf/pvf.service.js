/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class PvfService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = ['pvfAttachmentsAttachment'];
    }
    
    getFormNumber(pvf) {
        let response = '';
        for (let idx in pvf.responses) {
            if (pvf.responses[idx].question_tag === 'pvfTopPvfNumber') {
                response = pvf.responses[idx].response.value;
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

    getPvf(countryId, stationId, id) {
        if (id !== null) {
            return this.service.get(`api/pvf/${stationId}/${id}`);
        } else {
            return this.service.get(`api/pvf/blank/${stationId}`);
        }
    }
    
    removeTimeZoneAdjustment(pvf) {
        let dateTimeQuestions = [4];
        for (let idx=0; idx < pvf.responses.length; idx++) {
            let t1 = dateTimeQuestions.indexOf(pvf.responses[idx].question_tag);
            if (t1 > -1) {
                let dt = pvf.responses[idx].response.value;
                if (dt instanceof  Date) {
                    let tzo = dt.getTimezoneOffset();
                    dt.setMinutes(dt.getMinutes() - tzo);
                }
            }
        }
    }
    
    submitPvf(stationId, id, pvf) {
        if (id === null) {
            return this.postPvf(pvf);
        } else {
            return this.putPvf(stationId, id, pvf);
        }
    }
    
    putPvf(stationId, id, pvf) {
        let myPvf = jQuery.extend(true, {}, pvf);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myPvf);
        this.appendScannedForm(formData, myPvf.responses, myPvf.cards, this.getFormNumber(myPvf));
        formData.append("main", JSON.stringify(myPvf));
        return this.service.put(`api/pvf/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postPvf(pvf) {
        let myPvf = jQuery.extend(true, {}, pvf);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myPvf);
        this.appendScannedForm(formData, myPvf.responses, myPvf.cards, this.getFormNumber(myPvf));
        formData.append("main", JSON.stringify(myPvf));
        return this.service.post(`api/pvf/`, formData, {'Content-Type': undefined});
    }
    
    getFormConfig(formName) {
        let url=`api/forms/config/${formName}/?identifier=tag`;
        return this.service.get(url);
    }
    
    getAssociatedPersons(station_id, pvf_number) {
        let url = `api/person/associated/${station_id}/${pvf_number}/`;
        return this.service.get(url);
    }
    
    getGospelVerification(station_id, pvf_number) {
        let url = `api/gospel-verification/pvf-number/${station_id}/${pvf_number}/`;
        return this.service.get(url);
    }
    
    getRelatedForms(stationId, formNumber) {
        return this.service.get(`api/forms/related/${stationId}/${formNumber}/`);
    }
}