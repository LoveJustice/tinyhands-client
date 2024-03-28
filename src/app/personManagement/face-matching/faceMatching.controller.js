import './faceMatching.less';

class faceMatchingController {
    constructor($window, faceMatchingService, SessionService) {
        'ngInject';

        this.window = $window;
        this.faceMatchingService = faceMatchingService;
        this.session = SessionService;

        this.country = "";
        this.gender = "";
        this.role = "";

        this.getCountries();
    }

    getCountries() {
        this.faceMatchingService.getUserCountries(this.session.user.id).then((promise) => {
            this.countries = promise.data;
        });
    }

    submit() {
        if (this.uploadedPhoto) {
            this.window.location.href='/#!/FaceMatchingResults';

            // Package params
            let fd = new FormData();
            let params = {"country": this.country, "gender": this.gender, "role": this.role}

            fd.append('file', this.uploadedPhoto)
            fd.append('params', JSON.stringify(params))

            this.faceMatchingService.getFaceMatches(fd)
          } else {
            // TODO: Handle error
        }
    }
}

export default faceMatchingController;
