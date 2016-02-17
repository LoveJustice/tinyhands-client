import BaseService from '../../base.service';

export default class BudgetListService extends BaseService {
  constructor($http) {
    'ngInject';
    super($http);
  }

  getBudgetList() {
    return this.get('/api/budget/');
  }

  getBorderStationCodes() {
    return this.get('/api/border-station/');
  }

  deleteBorderStationBudget(id) {
    return this.delete('/api/budget/' + id);
  }
}