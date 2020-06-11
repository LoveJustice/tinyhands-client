export default class AttachmentModalController {
    constructor($uibModalInstance, $scope, isAdd, attachment, attachmentTypes, isViewing, modalActions, constants) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.$scope = $scope;
        this.isAdd = isAdd;
        this.attachment = attachment;
        this.attachmentTypes = attachmentTypes;
        this.isViewing = isViewing;
        this.modalActions = modalActions;
        this.constants = constants;
    }
    
    getScannedFormUrl(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }
    
    isString(val) {
        return typeof val === 'string';
    }
    
    save() {
        this.$uibModalInstance.close();
    }
    
    dismiss() {
        this.$uibModalInstance.dismiss();
    }
    
    delete() {
        this.modalActions.push('removeCard');
        this.$uibModalInstance.close();
    }
}