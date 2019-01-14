import associatedPersonTemplate from './associated-person.html';
import selectPersonTemplate from './selectPerson.html';
import SelectPersonController from './selectPersonController.js';

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
            let dateValue = '';
            if (person.birthdate && person.birthdate.value !== null && person.birthdate.value !== '') {
                dateValue = new Date(person.birthdate.value);
            }
            this.$scope.birthDate = {dateType:'person', value:dateValue};
        });
    }
}

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
            birthDate: "="
            }
    };

    return directive;
}