export default class EventModalCtrl {
    constructor($scope, $uibModalInstance, event) {
        'ngInject';

        this.event = event;
        this.uibModalInstance = $uibModalInstance;
    }

    close () {
        this.uibModalInstance.dismiss('cancel');
    }
}
