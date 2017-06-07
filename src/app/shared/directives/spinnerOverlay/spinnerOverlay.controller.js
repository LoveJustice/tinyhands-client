export default class SpinnerOverlayController {
    constructor(SpinnerOverlayService) {
        'ngInject';
        this.spinnerOverlayService = SpinnerOverlayService;
    }

    get isVisible() {
        return this.spinnerOverlayService.isVisible;
    }

    get message() {
        return this.spinnerOverlayService.message;
    }
}