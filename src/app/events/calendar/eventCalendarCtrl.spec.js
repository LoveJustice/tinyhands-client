import EventCalendarController from './eventCalendar.controller';
import EventsService from '../events.service';

describe('EventCalendarController', () => {
    let $q,
        rootScope,
        mockUibModal,
        mockUiCalendarConfig,
        mockEventsService,
        target;

    beforeEach(inject((_$q_, $rootScope) => {
        $q = _$q_;
        rootScope = $rootScope
        mockUibModal = jasmine.createSpyObj('MockUibModal', ['open']);
        mockUiCalendarConfig = {
            calendars:
            {
                eventCalendar:
                jasmine.createSpyObj('eventCalendar', ['fullCalendar'])
            }
        };
        mockEventsService = jasmine.createSpyObj('MockAccountService', ['destroyEvent']);

        target = new EventCalendarController(mockUibModal, mockUiCalendarConfig, mockEventsService);
    }));

    describe('onCalendarEventClicked', () => {
        it('should open modal', () => {
            let event = { id: 1, name: 'Foo' };
            mockUibModal.open.and.callFake(() => { return { result: $q.resolve() } });

            target.onCalendarEventClicked(event);

            expect(mockUibModal.open).toHaveBeenCalled();
        });

        describe('when event deletion confirmed', () => {
            it('should delete event', () => {
                let event = { id: 1, name: 'Foo' };
                mockUibModal.open.and.callFake(() => { return { result: $q.resolve() } });
                mockEventsService.destroyEvent.and.callFake(() => { return $q.resolve() });

                target.onCalendarEventClicked(event);
                rootScope.$apply();

                expect(mockEventsService.destroyEvent).toHaveBeenCalledWith(event.id);
            });

            describe('and event deleted', () => {
                it('should remove event from calendar', () => {
                    let event = { id: 1, name: 'Foo' };
                    mockUibModal.open.and.callFake(() => { return { result: $q.resolve() } });
                    mockEventsService.destroyEvent.and.callFake(() => { return $q.resolve() });

                    target.onCalendarEventClicked(event);
                    rootScope.$apply();

                    expect(mockUiCalendarConfig.calendars.eventCalendar.fullCalendar).toHaveBeenCalledWith('removeEvents', event.id);
                });
            });
        });
    })

});
