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
            let personCopy = _.cloneDeep(person);
            for (let key in this.$scope.ngModel.identifiers) {
                if (!(key in personCopy.identifiers)) {
                    personCopy.identifiers[key] = this.$scope.ngModel.identifiers[key];
                    personCopy.identifiers[key].location.value = '';
                    personCopy.identifiers[key].number.value = '';
                }
            }
            this.$scope.ngModel = personCopy;
            let dateValue = '';
            if (person.birthdate && person.birthdate.value !== null && person.birthdate.value !== '') {
                dateValue = new Date(person.birthdate.value);
            }
            this.$scope.birthDate = {dateType:'person', value:dateValue};
            if (this.$scope.idChoice) {
                for (let key in person.identifiers) {
                    this.$scope.idChoice =  key;
                    break;
                }
            }
            if (this.$scope.associatedController) {
                this.$scope.associatedController.associatedPersonChange(person);
            }
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
            birthDate: "=",
            idChoice: "=",
            associatedController: "="
            }
    };

    return directive;
}