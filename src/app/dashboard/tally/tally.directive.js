import TallyController from './tally.controller.js';

export default function TallyDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/dashboard/tally/tally.html',
        controller: TallyController,
        controllerAs: 'tally'
    };

    return directive;
}