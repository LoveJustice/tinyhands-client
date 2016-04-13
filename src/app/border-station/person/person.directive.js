import PersonController from './person.controller';

export default function PersonDirective() {
    'ngInject';
    
    let directive = {
        restrict: 'E',
        templateUrl: 'app/border-station/person/person.html',
        controller: PersonController,
        controllerAs: 'personCtrl'
    };
    
    return directive;
}