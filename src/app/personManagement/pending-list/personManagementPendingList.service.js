class PersonManagementPendingListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    listPendingMatches(queryParams) {
        return this.service.get('api/pending-match/', queryParams);
    }

    loadMorePendingMatches(queryParams) {
        return this.service.get('api/pending-match/', queryParams);
    }
    
    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=PERSON_MANAGEMENT`);
    }
}

export default PersonManagementPendingListService;
