class FaceMatchingListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    getUserCountries(id) {
        return this.service.get(`api/user_permission/countries/${id}/?permission_group=PERSON_MANAGEMENT`);
    }

    // Encode given image and return matching persons
    getFaceMatches(formData) {
        // return this.service.post(`api/face-matching/upload/`, formData);
        // return this.service.post(`api/face-matching/upload/`, formData, {'Content-Type': 'multipart/form-data'});
        return this.service.post(`api/face-matching/upload/`, formData, {'Content-Type': undefined});
    }
}
export default FaceMatchingListService;
