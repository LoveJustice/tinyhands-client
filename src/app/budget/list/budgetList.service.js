export default class BudgetListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    deleteBorderStationBudget(id) {
        return this.service.delete(`/api/budget/${id}/`);
    }

    getBudgetList(searchTerm, sortValue) {
        return this.service.get('/api/budget/', [{ name: "page_size", value: "25" }, { name: "search", value: searchTerm }, { name: "ordering", value: sortValue }]);
    }

    getNextBudgetPage(nextPageUrl) {
        return this.service.get(nextPageUrl);
    }

    getMdf(id) {
        return this.service.get(`/api/mdf/${id}/`);
    }

    sendMdfEmails(people) {
        return this.service.post(`/api/mdf/${people.budget_id}/`, people);
    }

}
