export default class ModalController {
    constructor($scope, $uibModalInstance, eventTitle) {
	    'ngInject';
        console.log(eventTitle);
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
