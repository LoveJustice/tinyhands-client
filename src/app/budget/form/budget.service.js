import BaseService from '../../base.service';

export default class BudgetService extends BaseService {
  constructor($http) {
    'ngInject';
    super();

    this.$http = $http;
  }

  getBudgetForm(id) {
    return this.get(`api/budget/${id}`);
  }
}