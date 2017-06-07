export default class CsvExportController {
    constructor($scope, FileDownloader) {
        'ngInject';

        this.buttonText = $scope.buttontext;
        this.getFileName = $scope.getFileName;
        this.servicefunction = $scope.exportServiceFunc;
        this.onExportComplete = $scope.onExportComplete;
        this.onExportError = $scope.onExportError;
        this.fileDownloader = FileDownloader;
    }

    exportCSV() {
        this.servicefunction().then((resp) => {
            this.fileDownloader.downloadFileAs([resp.data], this.getFileName(), this.fileDownloader.FILE_TYPE_CSV);
            this.onExportComplete();
        }, (err) => {
            this.onExportError(err);
        });
    }
}
