class PersonManagementListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    listKnownPersons(queryParams) {
        return this.service.get('api/idmgmt/', queryParams);
    }

    loadMoreKnownPersons(queryParams) {
        return this.service.get('api/idmgmt/', queryParams);
    }
}

export default PersonManagementListService;
