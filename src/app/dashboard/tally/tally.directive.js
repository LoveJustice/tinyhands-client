import TallyController from './tally.controller.js';
import tallyTemplate from './tally.html?url';
import './tally.less';

export default function TallyDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: tallyTemplate,
        controller: TallyController,
        controllerAs: 'tally'
    };

    return directive;
}