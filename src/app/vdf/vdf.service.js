/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class VdfService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = [692];
    }
    
    getFormNumber(vdf) {
        let response = '';
        for (let idx in vdf.responses) {
            if (vdf.responses[idx].question_id === 651) {
                response = vdf.responses[idx].response.value;
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

    getVdf(countryId, stationId, id) {
        if (id !== null) {
            return this.service.get(`api/vdf/${stationId}/${id}`);
        } else {
            return this.service.get(`api/vdf/blank/${stationId}`);
        }
    }
    
    removeTimeZoneAdjustment(vdf) {
        let dateTimeQuestions = [4];
        for (let idx=0; idx < vdf.responses.length; idx++) {
            let t1 = dateTimeQuestions.indexOf(vdf.responses[idx].question_id);
            if (t1 > -1) {
                let dt = vdf.responses[idx].response.value;
                if (dt instanceof  Date) {
                    let tzo = dt.getTimezoneOffset();
                    dt.setMinutes(dt.getMinutes() - tzo);
                }
            }
        }
    }
    
    submitVdf(stationId, id, vdf) {
        if (id === null) {
            return this.postVdf(vdf);
        } else {
            return this.putVdf(stationId, id, vdf);
        }
    }
    
    putVdf(stationId, id, vdf) {
        let myVdf = jQuery.extend(true, {}, vdf);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myVdf);
        this.appendScannedForm(formData, myVdf.responses, myVdf.cards, this.getFormNumber(myVdf));
        formData.append("main", JSON.stringify(myVdf));
        return this.service.put(`api/vdf/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postVdf(vdf) {
        let myVdf = jQuery.extend(true, {}, vdf);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myVdf);
        this.appendScannedForm(formData, myVdf.responses, myVdf.cards, this.getFormNumber(myVdf));
        formData.append("main", JSON.stringify(myVdf));
        return this.service.post(`api/vdf/`, formData, {'Content-Type': undefined});
    }
    
    getFormConfig(formName) {
        let url=`api/forms/config/${formName}/`;
        return this.service.get(url);
    }
    
    getAssociatedPersons(station_id, vdf_number) {
        let url = `api/person/associated/${station_id}/${vdf_number}/`;
        return this.service.get(url);
    }
}