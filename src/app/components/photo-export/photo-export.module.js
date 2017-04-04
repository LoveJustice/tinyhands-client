import sharedModule from '../../shared/shared.module';
import PhotoExportController from './photo-export.controller';
import PhotoExportModalController from './photo-export-modal.controller';
import PhotoExportDirective from './photo-export.directive';

export default angular.module('tinyhands.PhotoExport', [sharedModule])
    .controller('PhotoExportController', PhotoExportController)
    .controller('PhotoExportModalController', PhotoExportModalController)
    .directive('photoexport', PhotoExportDirective)
    .name;
