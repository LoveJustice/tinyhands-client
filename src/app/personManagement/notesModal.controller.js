import './personManagement.less';
export default class NotesModalController {
    constructor($uibModalInstance, modalActions) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.modalActions = modalActions;
    }
    
    proceed() {
        this.$uibModalInstance.close();
    }
    
    close() {
        this.$uibModalInstance.dismiss();
    }
}