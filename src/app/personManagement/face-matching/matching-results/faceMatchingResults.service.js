class FaceMatchingResultsService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=PERSON_MANAGEMENT`);
    }
}

export default FaceMatchingResultsService;
