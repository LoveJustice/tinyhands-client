import 'floatthead';
import 'angular-float-thead';
import moment from 'moment';
import 'moment-timezone';
import ngFileSaver from 'angular-file-saver';
import toastr from 'toastr';
import 'angular-ui-validate';

import config from './shared.config';

import BaseService from '../base.service';
import FileDownloaderServie from './services/fileDownloader.service';
import SessionService from './services/session.service';
import SpinnerOverlayService from './directives/spinnerOverlay/spinnerOverlay.service';
import StickyHeaderService from './services/stickyHeader.service';
import UtilService from './services/util.service';
import RequireLogin from './requireLogin';
import PermissionsRequired from './permissionsRequired';

import ConfirmButton from './directives/confirmButton/confirmButton.directive';
import Spinner from './directives/spinner/spinner.directive';
import SpinnerOverlay from './directives/spinnerOverlay/spinnerOverlay.directive';

export default angular.module('tinyhands.Shared', [ngFileSaver, 'floatThead', 'ui.validate'])
    .filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    })
    .config(config)
    .constant('RequireLogin', RequireLogin)
    .constant('toastr', toastr)
    .constant('moment', moment)

    .service('BaseService', BaseService)
    .service('FileDownloader', FileDownloaderServie)
    .service('SessionService', SessionService)
    .service('SpinnerOverlayService', SpinnerOverlayService)
    .service('StickyHeader', StickyHeaderService)
    .service('UtilService', UtilService)

    .directive('confirmButton', ConfirmButton)
    .directive('spinner', Spinner)
    .directive('spinnerOverlay', SpinnerOverlay)
    
    .run(PermissionsRequired)
    .name;
