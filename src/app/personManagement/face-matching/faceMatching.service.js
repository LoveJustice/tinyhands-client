class FaceMatchingListService {
    constructor(BaseService) {
        'ngInject';
        this.service = BaseService;
    }

    // Encode given image and return matching persons
    getFaceMatches(file) {
        return this.service.post(`api/face-encodings/upload/`, file);
    }
}

export default FaceMatchingListService;
