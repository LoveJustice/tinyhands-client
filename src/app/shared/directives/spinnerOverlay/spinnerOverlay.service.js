export default class SpinnerOverlayService {
    constructor() {
        this.initState();
    }

    show(message) {
        this.isVisible = true;
        this.message = message;
    }

    hide() {
        this.initState();
    }

    initState() {
        this.isVisible = false;
        this.message = '';
    }

}