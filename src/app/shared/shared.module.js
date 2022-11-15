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
import LocationService from '../components/location-select/location.service';
import SearchAddressService from '../components/address-entry/searchAddress.service';
import SessionService from './services/session.service';
import SpinnerOverlayService from './directives/spinnerOverlay/spinnerOverlay.service';
import StaffService from '../components/staff-select/staff.service';
import StickyHeaderService from './services/stickyHeader.service';
import UtilService from './services/util.service';
import TransitionOnBefore from './TransitionOnBefore';
import IncidentService from './services/incident.service';

import FormStepComponent from '../components/form-step/form-step.component';
import LocationSelectComponent from '../components/location-select/location-select.component';
import StaffSelectComponent from '../components/staff-select/staff-select.component';
import NameSelectComponent from '../components/name-select/name-select.component';
import CreateIncidentFormComponent from '../components/create-incident-form/create-incident-form.component';
import RelatedFormsComponent from '../components/related-forms/related-forms.component';

import ConfirmButton from './directives/confirmButton/confirmButton.directive';
import Spinner from './directives/spinner/spinner.directive';
import SpinnerOverlay from './directives/spinnerOverlay/spinnerOverlay.directive';

import MonthFilter from './filters/month.filter';
import CapitalizeFilter from './filters/capitalize.filter';

export default angular.module('tinyhands.Shared', [ngFileSaver, 'ngCookies', 'floatThead', 'ui.validate', uiRouter, 'angularjs-dropdown-multiselect'])
    .run(TransitionOnBefore)
    .config(config)

    .filter('capitalize', CapitalizeFilter)
    .filter('monthName', MonthFilter)

    .constant('toastr', toastr)
    .constant('moment', moment)

    .service('BaseService', BaseService)
    .service('FileDownloader', FileDownloaderService)
    .service('LocationService', LocationService)
    .service('SearchAddressService', SearchAddressService)
    .service('SessionService', SessionService)
    .service('SpinnerOverlayService', SpinnerOverlayService)
    .service('StaffService', StaffService)
    .service('StickyHeader', StickyHeaderService)
    .service('UtilService', UtilService)
    .service('IncidentService', IncidentService)

    .component('formStep', FormStepComponent)
    .component('locationSelect', LocationSelectComponent)
    .component('staffSelect', StaffSelectComponent)
    .component('nameSelect', NameSelectComponent)
    .component('createIncidentForm', CreateIncidentFormComponent)
    .component('relatedForms', RelatedFormsComponent)

    .directive('confirmButton', ConfirmButton)
    .directive('spinner', Spinner)
    .directive('spinnerOverlay', SpinnerOverlay)
    .name;