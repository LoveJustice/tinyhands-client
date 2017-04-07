import ConfirmButtonController from './confirmButton.controller';
import confirmButtonTemplate from './confirmButton.html';

export default function ConfirmButton() {
    'ngInject';
    let directive = {
        scope: {
            btnClass: '@',
            text: '@',
            confirmText: '@',
            disabled: '=',
            invisible: '&',
            onClick: '&',
            onConfirm: '&',
        },
        controller: ConfirmButtonController,
        controllerAs: 'ctrl',
        restrict: 'E',
        templateUrl: confirmButtonTemplate,
    };

    return directive;
}
