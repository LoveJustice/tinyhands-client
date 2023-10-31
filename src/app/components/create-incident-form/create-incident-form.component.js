import CreateIncidentFormTemplate from './create-incident-form.html?url';
import createIncidentModal from './createIncidentFormModal.html';
import CreateIncidentModalController from './createIncidentFormModalController.js';

export class CreateIncidentForm {
    constructor($scope, $uibModal, IncidentService) {
        'ngInject';
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.incidentService = IncidentService;
    } 

    create() {
        this.$uibModal.open({
            bindToController: true,
            controller: CreateIncidentModalController,
            controllerAs: 'vm',
            resolve: {
                incidentService: () => this.incidentService,
                stationsAdd: () => this.stationsAdd,
                useTitle: () => this.useTitle,
                formType: () => this.formType,
                selectOnly: () => this.selectOnly,
            },
            size: 'lg',
            templateUrl: createIncidentModal,
        }).result.then((selectedIncident) => {
        	this.callController.createForm(selectedIncident);
        });
    }
}

export default {
    bindings: {
        stationsAdd: '=',
        useTitle: '@',
        formType: '@',
        callController: '=',
        selectOnly: '@'
    },
    controllerAs: '$ctrl',
    controller: CreateIncidentForm,
    templateUrl: CreateIncidentFormTemplate,
    transclude: true
};