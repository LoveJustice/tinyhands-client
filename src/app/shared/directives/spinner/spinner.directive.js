import './spinner.less';
import template from './spinner.html';
import controller from './spinner.controller';

export default function SpinnerDirective() {
    let directive = {
        scope: {
            message: '@'
        },
        controller: controller,
        controllerAs: 'ctrl',
        restrict: 'E',
        templateUrl: template,
    };
    return directive;
}