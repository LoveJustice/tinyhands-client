import 'floatthead';
import 'angular-float-thead';
import moment from 'moment';
import 'moment-timezone';
import ngFileSaver from 'angular-file-saver';
import toastr from 'toastr';
import 'angular-ui-validate';
import uiRouter from '@uirouter/angularjs';
import 'angularjs-dropdown-multiselect';

import config from './shared.config';

import BaseService from '../base.service';
import FileDownloaderService from './services/fileDownloader.service';
import SessionService from './services/session.service';
import SpinnerOverlayService from './directives/spinnerOverlay/spinnerOverlay.service';
import StaffService from '../components/staff-select/staff.service';
import StickyHeaderService from './services/stickyHeader.service';
import UtilService from './services/util.service';
import TransitionOnBefore from './TransitionOnBefore';

import FormStepComponent from '../components/form-step/form-step.component';
import StaffSelectComponent from '../components/staff-select/staff-select.component';

import ConfirmButton from './directives/confirmButton/confirmButton.directive';
import Spinner from './directives/spinner/spinner.directive';
import SpinnerOverlay from './directives/spinnerOverlay/spinnerOverlay.directive';

import MonthFilter from './filters/month.filter';
import CapitalizeFilter from './filters/capitalize.filter';

export default angular.module('tinyhands.Shared', [ngFileSaver, 'floatThead', 'ui.validate', uiRouter, 'angularjs-dropdown-multiselect'])
    .run(TransitionOnBefore)
    .config(config)

    .filter('capitalize', CapitalizeFilter)
    .filter('monthName', MonthFilter)

    .constant('toastr', toastr)
    .constant('moment', moment)

    .service('BaseService', BaseService)
    .service('FileDownloader', FileDownloaderService)
    .service('SessionService', SessionService)
    .service('SpinnerOverlayService', SpinnerOverlayService)
    .service('StaffService', StaffService)
    .service('StickyHeader', StickyHeaderService)
    .service('UtilService', UtilService)

    .component('formStep', FormStepComponent)
    .component('staffSelect', StaffSelectComponent)

    .directive('confirmButton', ConfirmButton)
    .directive('spinner', Spinner)
    .directive('spinnerOverlay', SpinnerOverlay)
    .name;