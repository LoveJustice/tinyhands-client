import SpinnerOverlayService from './spinnerOverlay.service';

describe('SpinnerOverlayService', () => {

    let target;

    beforeEach(() => {
        target = new SpinnerOverlayService();
    });

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
});