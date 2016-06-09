import UnsavedChangesModalController from './unsavedChangesModal.controller';

describe('UnsavedChangesModalController', () => {
    let vm;
    let $uibModalInstance,
    $scope;


    beforeEach(inject(($rootScope) => {
        $scope = $rootScope.$new();
        $uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']);
        vm = new UnsavedChangesModalController($scope, $uibModalInstance);
    }));

    describe('function saveAndContinue', () => {
        it(`close should be called`, () => {
            vm.saveAndContinue();
            expect($uibModalInstance.close).toHaveBeenCalled();
        });
    });
    describe('function discardAndContinue', () => {
        it(`close should be called`, () => {
            vm.discardAndContinue();
            expect($uibModalInstance.close).toHaveBeenCalled();
        });
    });
    describe('function cancel', () => {
        it(`dismiss should be called`, () => {
            vm.cancel();
            expect($uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
});
