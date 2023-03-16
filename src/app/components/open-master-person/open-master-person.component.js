import OpenMasterPersonTemplateUrl from './open-master-person.html';

export class OpenMasterPersonController {
    constructor($scope, $state, BaseService) {
        'ngInject';
        this.$scope = $scope;
        this.state = $state;
        this.service = BaseService;
        this.url = null;
        this.requestedPerson = false;
    }
    
    $doCheck() {
        if (!this.personId) {
            return;
        }
        
        if (!this.requestedPerson) {
        	this.requestedPerson = true;
	        this.service.get(`api/person/${this.personId}/`).then ((response) => {
	        	if (response.data.master_person_id) {
	        		let params = {
	                        id: response.data.master_person_id,
	                    };
	        		this.url = this.state.href('personManagement', params);
	        	}
	        }, (error) => {alert(error)});
        }
        
    }
}

export default {
    bindings: {
        personId: '=',
    },
    controllerAs: 'ctrl',
    controller: OpenMasterPersonController,
    templateUrl: OpenMasterPersonTemplateUrl,
    transclude: true
};