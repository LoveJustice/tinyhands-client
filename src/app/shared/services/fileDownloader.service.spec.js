import FileDownloaderService from './fileDownloader.service';

describe('FileDownloaderService', () => {
    let target,
        blob,
        mockBlob,
        mockFileSaver;

    beforeEach(() => {
        blob = (data, options) => {
            return { data: data, type: options.type };
        };
        mockBlob = jasmine.createSpy('mockBlob', blob).and.callFake(blob);

        mockFileSaver = jasmine.createSpyObj('mockFileSaver', ['saveAs']);
        target = new FileDownloaderService(mockFileSaver, mockBlob);

    });

    describe('downloadFileAs', () => {
        it('should create blob with data array and fileType', () => {
            let data = 1;
            let fileType = 'csv';
            target.downloadFileAs(data, 'name', fileType);
            expect(mockBlob).toHaveBeenCalledWith([data], {type: fileType});
        });

        it('should save blob to file', () => {
            let data = 1;
            let fileType = 'csv';
            let fileName = 'hello';
            let expectedBlobData = blob([data], {type: fileType});

            target.downloadFileAs(data, fileName, fileType);

            expect(mockFileSaver.saveAs).toHaveBeenCalledWith(expectedBlobData, fileName);
        });
    });
});