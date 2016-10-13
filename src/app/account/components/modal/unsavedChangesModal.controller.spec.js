import UnsavedChangesModalController from './unsavedChangesModal.controller';

describe('UnsavedChangesModalController', () => {
    let controller,
        $uibModalInstance;

    beforeEach(() => {
        $uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']);
        controller = new UnsavedChangesModalController($uibModalInstance);
    });

    describe('when saving and continueing', () => {
        it(`should close with true`, () => {
            controller.saveAndContinue();
            expect($uibModalInstance.close).toHaveBeenCalledWith(true);
        });
    });

    describe('when discarding and continueing', () => {
        it(`should close with false`, () => {
            controller.discardAndContinue();
            expect($uibModalInstance.close).toHaveBeenCalledWith(false);
        });
    });

    describe('when canceling navigation', () => {
        it(`should call dismiss`, () => {
            controller.cancel();
            expect($uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
});
