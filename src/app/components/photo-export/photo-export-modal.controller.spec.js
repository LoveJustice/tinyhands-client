import PhotoExportModalController from './photo-export-modal.controller';

describe('Photo Export Controller',() => {
    let vm,
        $uibModalInstance,
        $window,
        MockBaseService,
        fromDate,
        toDate;

    beforeEach(inject((_$window_) => {
        $window = _$window_;
        vm = new PhotoExportModalController($uibModalInstance, $window, MockBaseService);

        fromDate = new Date(2016, 5, 15);
        toDate = new Date(2016, 5, 15);
    }));

    describe('function getExportUrl', () => {
        it('expect it to create the export url', () => {
            var val = vm.getExportUrl(fromDate, toDate);
            expect(val).toBe('http://localhost/api/photos/6-15-2016/6-15-2016/');
        });
    });

    describe('function getPhotoCountUrl', () => {
        it('expect it to create the url', () => {
            var val = vm.getPhotoCountUrl(fromDate, toDate);
            expect(val).toBe('api/photos/6-15-2016/6-15-2016/count/');
        });
    });

    describe('function parseDate', () => {
        it('expect it to create the url', () => {
            var val = vm.parseDate(fromDate);
            expect(val).toBe('6-15-2016');
        });
    });

    describe('function validDate', () => {
        it('expect invalid date selection to be false', () => {
            var val = vm.validDate();
            expect(val).toBe(false);
        });

        it('expect invalid date selection with photos to be false', () => {
            var val = vm.validDate();
            vm.numberOfPhotos = 1;
            expect(val).toBe(false);
        });

        it('expect valid dates with photos to be true', () => {
            vm.fromDate = new Date(2016, 5, 15);
            vm.toDate = new Date(2016, 6, 15);
            vm.numberOfPhotos = 1;

            var val = vm.validDate();
            expect(val).toBe(true);
        });

        it('expect valid dates without photos to be false', () => {
            vm.fromDate = new Date(2016, 5, 15);
            vm.toDate = new Date(2016, 6, 15);
            vm.numberOfPhotos = 0;

            var val = vm.validDate();
            expect(val).toBe(false);
        });
    });
});
