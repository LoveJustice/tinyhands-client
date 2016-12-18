import BaseService from '../base.service';
import SessionService from './services/session.service';
import StickyHeaderService from './services/stickyHeader.service';
import UtilService from './services/util.service';
import RequireLogin from './requireLogin';

import ConfirmButton from './directives/confirmButton/confirmButton.directive';

export default angular.module('tinyhands.Shared', ['floatThead', 'ui.validate'])
    .filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    })
    .constant('RequireLogin', RequireLogin)

    .service('StickyHeader', StickyHeaderService)

    .service('BaseService', BaseService)
    .service('SessionService', SessionService)
    .service('UtilService', UtilService)

    .directive('confirmButton', ConfirmButton);
