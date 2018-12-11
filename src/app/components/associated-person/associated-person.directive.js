import associatedPersonTemplate from './associated-person.html';
import selectPersonTemplate from './selectPerson.html';
import SelectPersonController from './selectPersonController.js';

export default function AssociatedPersonDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: associatedPersonTemplate,
        controller: AssociatedPersonController,
        controllerAs: 'ctrl',
        scope: {
            ngModel: '=',
            personList: "=",
        }
    };

    return directive;
}

class AssociatedPersonController {
    constructor($scope, $uibModal) {
        'ngInject';
        this.$scope = $scope;
        this.$uibModal = $uibModal;
    }
    
    selectPerson() {
        this.$uibModal.open({
            bindToController: true,
            controller: SelectPersonController,
            controllerAs: 'vm',
            resolve: {
                personList: () => this.$scope.personList,
            },
            size: 'md',
            templateUrl: selectPersonTemplate,
        }).result.then((person) => {
            this.$scope.ngModel = person;
        });
}
}