/*global FormData */
/* global jQuery */
// Common service used for all IRF forms
export default class MonthlyReportService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
        this.file_questions = [692];
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
    
    submitMonthlyReport(stationId, id, monthlyReport) {
        if (id === null) {
            return this.postMonthlyReport(monthlyReport);
        } else {
            return this.putMonthlyReport(stationId, id, monthlyReport);
        }
    }
    
    putMonthlyReport(stationId, id, monthlyReport) {
        let myMonthlyReport = jQuery.extend(true, {}, monthlyReport);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myMonthlyReport);
        formData.append("main", JSON.stringify(myMonthlyReport));
        return this.service.put(`api/monthly_report/${stationId}/${id}`, formData, {'Content-Type': undefined});
    }
    
    postMonthlyReport(monthlyReport) {
        let myMonthlyReport = jQuery.extend(true, {}, monthlyReport);
        let formData = new FormData();
        this.removeTimeZoneAdjustment(myMonthlyReport);
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
}