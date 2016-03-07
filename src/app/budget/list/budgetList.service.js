import BaseService from '../../base.service';

export default class BudgetListService extends BaseService {
  constructor($http) {
    'ngInject';
    super($http);
  }

  getBudgetList() {
    return this.get('/api/budget/',['page_size=2']);
  }

  deleteBorderStationBudget(id) {
    return this.delete(`/api/budget/${id}/`);
  }
}