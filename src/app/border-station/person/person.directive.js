import PersonController from './person.controller';
import personTemplate from './person.html';

export default function PersonDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: personTemplate,
        controller: PersonController,
        controllerAs: 'personCtrl'
    };

    return directive;
}