import BaseService from '../../base.service';

export default class BudgetListService extends BaseService {
  constructor($http) {
    'ngInject';
    super($http);
  }

  deleteBorderStationBudget(id) {
    return this.delete(`/api/budget/${id}/`);
  }

  getBudgetList(searchTerm, sortValue) {
    return this.get('/api/budget/', [{ name: "page_size", value: "25" }, { name: "search", value: searchTerm }, {name: "ordering", value: sortValue }]);
  }

  getNextBudgetPage(nextPageUrl) {
    return this.$http.get(nextPageUrl);
  }
}