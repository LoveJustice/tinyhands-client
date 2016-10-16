import CsvExportController from './csv-export.controller';

describe('MDF Controller', () => {
    let vm,
        $scope,
        $window;

    beforeEach(inject(() => {
        $scope = { "type": "", "buttonText": "" };
        $window = jasmine.createSpyObj('$window', ['open']);
        vm = new CsvExportController($scope, $window);
    }));

    describe('function typeToUrl', () => {
        it('expect it to create the irf url', () => {
            var val = vm.typeToUrl('irf');
            expect(val).toContain('irf');
        });
        it('expect it to create the vif url', () => {
            var val = vm.typeToUrl('vif');
            expect(val).toContain('vif');
        });
    });

    describe('exportCSV', () => {
        it('should call window.open with url', () => {
            vm.exportCSV();

            expect($window.open).toHaveBeenCalledWith(vm.url, '_blank');
        });
    });
});
