import SpinnerOverlayService from './spinnerOverlay.service';

describe('SpinnerOverlayService', () => {

    let target;

    beforeEach(inject(($rootScope) => {
        target = new SpinnerOverlayService($rootScope);
    }));

    describe('when showing', () => {
        it('should set isVisible to true', () => {
            target.show('message');

            expect(target.isVisible).toBe(true);
        });

        it('should set message to true', () => {
            let message = 'hi';

            target.show(message);

            expect(target.message).toBe(message);
        });
    });

    describe('when hiding', () => {
        it('should set isVisible to false', () => {
            target.hide();

            expect(target.isVisible).toBe(false);
        });

        it('should clear message', () => {
            target.hide();

            expect(target.message).toBe('');
        });
    });

    describe('onStateChangeStart', () => {
        let mockEvent;

        beforeEach(() => {
            mockEvent = jasmine.createSpyObj('mockEvent', ['preventDefault']);
        });

        describe('when spinner is visible', () => {
            it('should prevent state change event', () => {
                target.isVisible = true;

                target.onStateChangeStart(mockEvent);

                expect(mockEvent.preventDefault).toHaveBeenCalled();
            });
        });

        describe('when spinner is not visible', () => {
            it('should not prevent state change event', () => {
                target.isVisible = false;

                target.onStateChangeStart(mockEvent);

                expect(mockEvent.preventDefault).not.toHaveBeenCalled();
            });
        });
    });
});