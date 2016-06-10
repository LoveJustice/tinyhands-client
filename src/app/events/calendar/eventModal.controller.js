export default class EventModalCtrl {
    constructor($scope, $uibModalInstance, event) {
        'ngInject';

        this.event = event;
        this.uibModalInstance = $uibModalInstance;
    }

    close () {
        this.uibModalInstance.dismiss('cancel');
    }

    delete (event) {
        if (event.delete_event) {
            this.uibModalInstance.dismiss('delete');
        } else {
            event.delete_event = true;
        }
    }
}
