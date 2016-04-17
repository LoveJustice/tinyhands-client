export default class EventModalCtrl {
    constructor($scope, $modalInstance, event) {
        'ngInject';

        this.event = event;
    }

    close () {
        $modalInstance.dismiss('cancel');
    }
}
