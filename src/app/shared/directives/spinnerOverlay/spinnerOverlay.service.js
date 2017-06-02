export default class SpinnerOverlayService {
    constructor($rootScope) {
        this.initState();

        let onStateChangeStart = this.onStateChangeStart.bind(this);
        $rootScope.$on('$stateChangeStart', onStateChangeStart);
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

    onStateChangeStart(event) {
        if(this.isVisible) {
            event.preventDefault();
        }
    }

}