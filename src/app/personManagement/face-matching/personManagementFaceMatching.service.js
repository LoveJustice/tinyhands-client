class PersonManagementFaceMatchingListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    listFaceEncodings(queryParams) {
        return this.service.get('api/face-encodings/', queryParams);
    }

    loadMoreEncodedPersons(queryParams) {
        return this.service.get('api/face-encodings/', queryParams);
    }

    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=PERSON_MANAGEMENT`);
    }

    // getFaceEncoding(person_id) {
    //     return this.service.get(`api/face-encodings/${person_id}/`);
    // }
}

export default PersonManagementFaceMatchingListService;
