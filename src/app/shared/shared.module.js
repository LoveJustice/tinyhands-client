import 'floatthead';
import 'angular-float-thead';
import moment from 'moment';
import 'moment-timezone';
import toastr from 'toastr';
import 'angular-ui-validate';

import config from './shared.config';

import BaseService from '../base.service';
import SessionService from './services/session.service';
import StickyHeaderService from './services/stickyHeader.service';
import UtilService from './services/util.service';
import RequireLogin from './requireLogin';
import PermissionsRequired from './permissionsRequired';

import ConfirmButton from './directives/confirmButton/confirmButton.directive';

export default angular.module('tinyhands.Shared', ['floatThead', 'ui.validate'])
    .filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    })
    .config(config)
    .constant('RequireLogin', RequireLogin)
    .constant('toastr', toastr)
    .constant('moment', moment)

    .service('StickyHeader', StickyHeaderService)

    .service('BaseService', BaseService)
    .service('SessionService', SessionService)
    .service('UtilService', UtilService)

    .directive('confirmButton', ConfirmButton)
    
    .run(PermissionsRequired)
    .name;
