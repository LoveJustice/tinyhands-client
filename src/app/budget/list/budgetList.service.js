export default class BudgetListService{
  constructor(BaseService) {
    'ngInject';
    this.service = BaseService;
  }

  getBudgetList() {
    return this.service.get('/api/budget/');
  }

  deleteBorderStationBudget(id) {
    return this.service.delete(`/api/budget/${id}/`);
  }
}