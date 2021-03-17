import './budget.less';
export default class DetailModalController {
    constructor($uibModalInstance, modalActions) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.modalActions = modalActions;
    }
    
    save() {
        this.$uibModalInstance.close();
    }
    
    close() {
        this.$uibModalInstance.dismiss();
    }
}