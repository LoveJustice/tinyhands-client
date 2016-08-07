import ConfirmButtonController from './confirmButton.controller';

export default function ConfirmButton() {
    'ngInject';
    let directive = {
        scope: {
            text: '@',
            confirmText: '@',
            onClick: '&',
            onConfirm: '&',
        },
        controller: ConfirmButtonController,
        controllerAs: 'ctrl',
        restrict: 'E',
        templateUrl: 'app/account/components/confirmButton/confirmButton.html'
    };
    
    return directive;
}