export default class AddAddress1Controller {
	constructor($uibModal, $uibModalInstance, $scope, address1Service, address1Name) {
		'ngInject';
		this.$uibModalInstance = $uibModalInstance;
		this.scope = $scope;
		this.scope.address = {
    			name:address1Name,
    			latitude:0,
    			longitude:0,
    			level:'District',
    			completed:false
    	};
		this.address1Service = address1Service;
	}
	
	save() {
		this.address1Service.addAddress(this.scope.address)
		.then((response) => {
			 this.$uibModalInstance.close(response.data);
        });
	}
	
    cancel() {
        this.$uibModalInstance.dismiss();
    }
}