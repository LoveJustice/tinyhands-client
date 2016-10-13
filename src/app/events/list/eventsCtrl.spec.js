import EventsController from './events.controller';

describe('EventCalendarController', () => {
    let scope, controller, mockModal, mockEventsService, mockEvent, $q;

    beforeEach(inject(($rootScope, _$q_) => {
        $q = _$q_;
        scope = $rootScope.$new();
        mockModal = jasmine.createSpyObj('mockModal', ['open']);
        mockEvent = { title: 'foo', id: 1 };

        mockEventsService = jasmine.createSpyObj('mockEventsService', ['getAll', 'destroyEvent']);
        mockEventsService.getAll.and.returnValue({ "then": () => { return mockEvent; } });
        mockEventsService.destroyEvent.and.returnValue({ "then": () => { return mockEvent; } });

        controller = new EventsController(mockEventsService, mockModal);
    }));

    describe('on activate', () => {
        it('should display all the events', () => {
            expect(mockEventsService.getAll).toHaveBeenCalled();
        });
    });

    describe('when delete button onclick', () => {
        it('should open Modal', () => {
            mockModal.open.and.returnValue({ result: $q.when(true) });
            controller.openModal(mockEvent);
            scope.$apply();

            expect(mockModal.open).toHaveBeenCalled();
            var modalArgs = mockModal.open.calls.mostRecent().args[0];
            expect(modalArgs.resolve.eventTitle()).toEqual(mockEvent.title);
        });

        it('should delete the event after the result', () => {

            mockModal.open.and.returnValue({ result: $q.when(true) });
            controller.openModal(mockEvent);
            scope.$apply();

            expect(mockEventsService.destroyEvent).toHaveBeenCalledWith(mockEvent.id);
        });

        it('should load all events after an event is deleted', () => {

            mockModal.open.and.returnValue({ result: $q.when(true) });
            controller.openModal(mockEvent);
            scope.$apply();

            expect(mockEventsService.getAll).toHaveBeenCalled();
        });
    });
});
//
//
//
// });
