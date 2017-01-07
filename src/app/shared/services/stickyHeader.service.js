export default class StickyHeaderController {
    constructor() {
        'ngInject';

        this.stickyOptions = {
            scrollingTop: 50,
            useAbsolutePositioning: false
        };
    }
}
