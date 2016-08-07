import PhotoExportController from './photo-export.controller';
import PhotoExportModalController from './photo-export-modal.controller';
import PhotoExportDirective from './photo-export.directive';

export default angular.module('tinyhands.PhotoExport', ['tinyhands.Shared'])
  .controller('PhotoExportController', PhotoExportController)
  .controller('PhotoExportModalController', PhotoExportModalController)
  .directive('photoexport', PhotoExportDirective);
