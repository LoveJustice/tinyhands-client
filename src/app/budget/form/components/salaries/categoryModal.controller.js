import '../../budget.less';
export default class CategoryModalController {
    constructor($uibModalInstance, modalActions) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.modalActions = modalActions;
    }
    
    add() {
        this.$uibModalInstance.close();
    }
    
    close() {
        this.$uibModalInstance.dismiss();
    }
}