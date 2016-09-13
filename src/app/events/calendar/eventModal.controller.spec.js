import EventModalController from './eventModal.controller';

describe('EventModalController', () => {
    let target,
        event, 
        mockUibModalInstance;

    beforeEach(()=> {
        event = {id:1, name: 'Foo'};
        mockUibModalInstance = jasmine.createSpyObj('MockUibModalInstance', ['close', 'dismiss'])

        target = new EventModalController(mockUibModalInstance, event);
    });

    describe('close', () => {
        it('should dismiss modal', () => {
            target.close();

            expect(mockUibModalInstance.dismiss).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should close modal', () => {
            target.delete();

            expect(mockUibModalInstance.close).toHaveBeenCalled();
        });
    });

});

