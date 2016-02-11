import BaseService from '../../base.service';

export default class BudgetListService extends BaseService {
  constructor($http) {
    'ngInject';
    super();

    this.$http = $http;
  }

  getBudgetList() {
    return this.get('api/budget/');
  }
}