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

  getStaff(bsId) {
    if (bsId) {
      return this.get(`api/staff/?border_station=${bsId}`);
    }
  }

  getStaffSalaries(budgetId) {
    return this.get(`api/budget/staff_salary/${budgetId}/`);
  }
}