import sharedModule from '../../shared/shared.module';
import FormExportController from './form-export.controller';
import FormExportModalController from './form-export-modal.controller';
import FormExportDirective from './form-export.directive';

export default angular.module('tinyhands.FormExport', [sharedModule])
    .controller('FormExportController', FormExportController)
    .controller('FormExportModalController', FormExportModalController)
    .directive('formexport', FormExportDirective)
    .name;
