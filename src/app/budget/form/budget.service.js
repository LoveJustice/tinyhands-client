import BaseService from '../../base.service';

export default class BudgetService extends BaseService {
  constructor($http) {
    'ngInject';
    super();

    this.$http = $http;
  }

  getBorderStation(id) {
    return this.get(`api/border-station/${id}/`);
  }

  getBudgetForm(id) {
    return this.get(`api/budget/${id}/`);
  }

  getOtherItems(budgetId, formSection) {
    return this.get(`api/budget/${budgetId}/item/?form_section=${formSection}`);
  }

  getPreviousData(borderStationId, month, year) {
    return this.get(`api/budget/previous_data/${borderStationId}/${month}/${year}/`);
  }

  getStaff(borderStationId) {
    if (borderStationId) {
      return this.get(`api/staff/?border_station=${borderStationId}`);
    }
  }

  getStaffSalaries(budgetId) {
    return this.get(`api/budget/staff_salary/${budgetId}/`);
  }
}