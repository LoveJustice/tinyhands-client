import './spinner.less';
import Template from './spinner.html?url';
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