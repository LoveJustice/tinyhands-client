export default class BudgetService {
  constructor(BaseService) {
    'ngInject';
    this.service = BaseService
  }

  getBorderStation(id) {
    return this.service.get(`api/border-station/${id}/`);
  }

  getBudgetForm(id) {
    return this.service.get(`api/budget/${id}/`);
  }

  getOtherItems(budgetId, formSection) {
    return this.service.get(`api/budget/${budgetId}/item/?form_section=${formSection}`);
  }

  getStaff(bsId) {
    if (bsId) {
      return this.service.get(`api/staff/?border_station=${bsId}`);
    }
  }

  getStaffSalaries(budgetId) {
    return this.service.get(`api/budget/staff_salary/${budgetId}/`);
  }
}