import CsvExportController from './csv-export.controller';

describe('CsvExportController', () => {
    let target,
        $scope,
        response,
        fileName,
        getFileName,
        serviceFunc,
        onExportComplete,
        onExportError,
        mockFileDownloaderService,
        $q,
        $rootScope;

    beforeEach(inject((_$q_, _$rootScope_) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        response = {data: 1};
        fileName = 'test';
        getFileName = jasmine.createSpy('getFileName').and.callFake(() => fileName);
        serviceFunc = jasmine.createSpy('serviceFunc').and.callFake(() => $q.resolve(response));
        onExportComplete = jasmine.createSpy('onExportComplete');
        onExportError = jasmine.createSpy('onExportError');

        $scope = {
            "buttonText": "",
            "getFileName": getFileName,
            "exportServiceFunc": serviceFunc,
            "onExportComplete": onExportComplete,
            "onExportError": onExportError
        };
        mockFileDownloaderService = jasmine.createSpyObj('mockFileDownloaderService', ['downloadFileAs']);
        mockFileDownloaderService.FILE_TYPE_CSV = 'text/csv';
        target = new CsvExportController($scope, mockFileDownloaderService);
    }));



    describe('exportCSV', () => {
        it('should call service function', () => {
            target.exportCSV();

            expect(serviceFunc).toHaveBeenCalled();
        });

        describe('when data received', () => {
            it('should save data to file', () => {
                target.exportCSV();
                $rootScope.$apply();

                expect(mockFileDownloaderService.downloadFileAs).toHaveBeenCalledWith([response.data], fileName, mockFileDownloaderService.FILE_TYPE_CSV);
            });

            it('should call onExportComplete', () => {
                target.exportCSV();
                $rootScope.$apply();

                expect(onExportComplete).toHaveBeenCalled();
            });
        });

        describe('when service function errors', () => {
            it('should call onExportError', () => {
                let error = {err: 'error'};
                serviceFunc = serviceFunc.and.callFake(() => $q.reject(error));

                target.exportCSV();
                $rootScope.$apply();

                expect(onExportError).toHaveBeenCalledWith(error);
            });
        });
    });
});
