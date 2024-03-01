class ConfirmCModalontroller{
	constructor($uibModalInstance, message, acceptLabel, declineLabel, modalActions) {
        'ngInject';
        this.$uibModalInstance = $uibModalInstance;
        this.message = message;
        this.acceptLabel = acceptLabel;
        this.declineLabel = declineLabel;
        this.modalActions = modalActions;
    }
    accept() {
    	this.modalActions.push(true);
    	this.$uibModalInstance.close();
    }
    decline() {
    	this.modalActions.push(false);
    	this.$uibModalInstance.close();
    }
}

module.exports = ConfirmCModalontroller;