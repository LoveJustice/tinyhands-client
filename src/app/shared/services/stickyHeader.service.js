export default class StickyHeaderController {
    constructor() {
        'ngInject';

        this.sticky = {
            scrollingTop: 50,
            useAbsolutePositioning: false
        }
    }
}
