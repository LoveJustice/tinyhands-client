import CsvExportController from './csv-export.controller';

describe('CSV Export Controller',() => {
    let vm,
        $scope;

    beforeEach(inject(() => {
        $scope = {"type": "", "buttonText": ""};

        vm = new CsvExportController($scope);
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
});
