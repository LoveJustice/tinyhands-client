/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class MonthlyReportService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = [910];
    }
    
    getFormNumber(monthlyReport, stationName) {
        let response = stationName;
        let year = '';
        let month = '';
        for (let idx in monthlyReport.responses) {
            if (monthlyReport.responses[idx].question_id === 714) {
                year = monthlyReport.responses[idx].response.value;
            }
            if (monthlyReport.responses[idx].question_id === 715) {
                month = monthlyReport.responses[idx].response.value;
            }
            if (year !== '' && month !== '') {
                break;
            }
        }
        response = response + '_' + year + '_' + month;
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

    getMonthlyReport(countryId, stationId, id) {
        if (id !== null) {
            return this.service.get(`api/monthly_report/${stationId}/${id}`);
        } else {
            return this.service.get(`api/monthly_report/blank/${stationId}`);
        }
    }
    
    removeTimeZoneAdjustment(monthlyReport) {
        let dateTimeQuestions = [];
        for (let idx=0; idx < monthlyReport.responses.length; idx++) {
            let t1 = dateTimeQuestions.indexOf(monthlyReport.responses[idx].question_id);
            if (t1 > -1) {
                let dt = monthlyReport.responses[idx].response.value;
                if (dt instanceof  Date) {
                    let tzo = dt.getTimezoneOffset();
                    dt.setMinutes(dt.getMinutes() - tzo);
                }
            }
        }
    }
    
    submitMonthlyReport(stationId, id, monthlyReport, stationName) {
        if (id === null) {
            return this.postMonthlyReport(monthlyReport, stationName);
        } else {
            return this.putMonthlyReport(stationId, id, monthlyReport, stationName);
        }
    }
    
    putMonthlyReport(stationId, id, monthlyReport, stationName) {
        let myMonthlyReport = jQuery.extend(true, {}, monthlyReport);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myMonthlyReport);
        this.appendScannedForm(formData, myMonthlyReport.responses, myMonthlyReport.cards, this.getFormNumber(myMonthlyReport, stationName));
        formData.append("main", JSON.stringify(myMonthlyReport));
        return this.service.put(`api/monthly_report/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postMonthlyReport(monthlyReport, stationName) {
        let myMonthlyReport = jQuery.extend(true, {}, monthlyReport);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myMonthlyReport);
        this.appendScannedForm(formData, myMonthlyReport.responses, myMonthlyReport.cards, this.getFormNumber(myMonthlyReport, stationName));
        formData.append("main", JSON.stringify(myMonthlyReport));
        return this.service.post(`api/monthly_report/`, formData, {'Content-Type': undefined});
    }
    
    getFormConfig(formName) {
        let url=`api/forms/config/${formName}/`;
        return this.service.get(url);
    }
    
    getAssociatedPersons(station_id, monthlyReport_number) {
        let url = `api/person/associated/${station_id}/${monthlyReport_number}/`;
        return this.service.get(url);
    }
    
    getStation(stationId) {
        return this.service.get(`api/border-station/${stationId}/`);
    }
    
    getMonthlyReportSummary(countryId,year, month) {
        return this.service.get(`api/monthly_report/summary/${countryId}/${year}/${month}/`);
    }
}