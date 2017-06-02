import './spinnerOverlay.less';
import template from './spinnerOverlay.html';
import controller from './spinnerOverlay.controller';

export default function SpinnerOverlayDirective() {
    let directive = {
        controller: controller,
        controllerAs: 'ctrl',
        restrict: 'E',
        templateUrl: template,
    }
    return directive;
}