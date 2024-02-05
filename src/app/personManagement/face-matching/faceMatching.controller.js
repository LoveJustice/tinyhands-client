import './faceMatching.less';

class faceMatchingController {
    constructor($window, faceMatchingService) {
        'ngInject';

        this.window = $window;
        this.faceMatchingService = faceMatchingService;

        let tmp = sessionStorage.getItem('personManagement-search');
        if (tmp !== null) {
            this.searchValue = tmp;
        }
        tmp = sessionStorage.getItem('personManagement-country');
        if (tmp !== null) {
            this.countryId = tmp;
        }
        tmp = sessionStorage.getItem('personManagement-match');
        if (tmp !== null) {
            this.matchType = tmp;
        }
    }

    submit() {
        if (this.uploadedPhoto) {
            this.window.location.href='/#!/FaceMatchingResults';
            // Convert image to base 64
            const file_base64 = btoa(this.uploadedPhoto.$ngfDataUrl);

            let tmp = sessionStorage.getItem('uploadedPhoto');
            if (!tmp) {
                sessionStorage.setItem('uploadedPhoto', file_base64);
            }

            this.faceMatchingService.getFaceMatches(sessionStorage.getItem('uploadedPhoto'));
          } else {
            // TODO: Handle error
        }
    }
}

export default faceMatchingController;
