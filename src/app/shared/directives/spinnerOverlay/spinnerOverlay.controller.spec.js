import SpinnerOverlayController from './spinnerOverlay.controller';

describe('SpinnerOverlayController', () => {
    let target,
        MockSpinnerOverlayService;

    beforeEach(() => {
        MockSpinnerOverlayService = { isVisible: true, message: 'Hi'};

        target = new SpinnerOverlayController(MockSpinnerOverlayService);
    });

    describe('isVisible ', () => {
        it('should match SpinnerOverlayService isVisible', () => {
            expect(target.isVisible).toBe(MockSpinnerOverlayService.isVisible);
        });
    });

    describe('isVisible ', () => {
        it('should match SpinnerOverlayService message', () => {
            expect(target.message).toBe(MockSpinnerOverlayService.message);
        });
    });
});