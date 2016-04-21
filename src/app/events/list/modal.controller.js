export default class ModalController {
    constructor($scope, $uibModalInstance, eventTitle) {
	    'ngInject';

        this.modalInstance = $uibModalInstance;
        this.eventTitle = eventTitle;
    };

    delete() {
        this.modalInstance.close(true);
    }

    cancel() {
        this.modalInstance.dismiss("cancel");
    }
}
