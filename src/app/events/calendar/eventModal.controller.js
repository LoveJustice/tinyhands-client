export default class EventModalCtrl {
    constructor($scope, $uibModalInstance, event) {
        'ngInject';

        this.event = event;
        this.uibModalInstance = $uibModalInstance;
    }

    close () {
        this.uibModalInstance.dismiss();
    }

    delete (event) {
        if (event.delete_event) {
            this.uibModalInstance.close();
        } else {
            event.delete_event = true;
        }
    }
}
