export default class MonthlyReportListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getMonthlyReportList(queryParameters) {
        return this.service.get('api/monthly_report/', queryParameters);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=MONTHLY_REPORT&form_present=true`);
    }
    
    getUserStationsForAdd(id) {
        return this.service.get(`api/user_permission/stations/${id}/?permission_group=MONTHLY_REPORT&form_present=true&action=ADD`);
    }

    getMoreMonthlyReports(queryParameters) {
        return this.service.get('api/monthly_report/', queryParameters);
    }

    deleteMonthlyReport(stationId, id){
        return this.service.delete(`api/monthly_report/${stationId}/${id}/`);
    }
    
    getFormForStation(stationId) {
        return this.service.get('api/forms/?type_name=MONTHLY_REPORT&station_id=' + stationId);
    }
}
