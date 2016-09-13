export default class EventModalCtrl {
    constructor($uibModalInstance, event) {
        'ngInject';
        this.event = event;
        this.uibModalInstance = $uibModalInstance;
    }

    close() {
        this.uibModalInstance.dismiss();
    }

    delete() {
        this.uibModalInstance.close();        
    }
}
