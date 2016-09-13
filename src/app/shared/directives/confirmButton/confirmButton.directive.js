import ConfirmButtonController from './confirmButton.controller';

export default function ConfirmButton() {
    'ngInject';
    let directive = {
        scope: {
            btnClass: '@',
            text: '@',
            confirmText: '@',
            invisible: '&',
            onClick: '&',
            onConfirm: '&',
        },
        controller: ConfirmButtonController,
        controllerAs: 'ctrl',
        restrict: 'E',
        templateUrl: 'app/shared/directives/confirmButton/confirmButton.html',
    };
    
    return directive;
}