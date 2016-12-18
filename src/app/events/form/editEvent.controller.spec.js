import EditEventCtrl from './editEvent.controller';

describe('EditEventCtrl', () => {
    let controller, state, stateParams, mockToastr, mockMoment, mockEventsService, $rootScope, $q;

    let newEvent = {
        id: 1,
        title: 'studio',
        location: 'lab',
        start_date: '2016-03-15',
        start_time: '14:00',
        end_date: '2016-03-15',
        end_time: '16:00',
        description: 'do karma test',
        is_repeat: true,
        repetition: 'W',
        ends: '2016-03-22',
    };
    
    let nonRepeatingEvent = {
        title: 'Non repeating event',
        location: 'No where',
        start_date: '2016-03-15',
        start_time: '14:00',
        end_date: '2016-03-15',
        end_time: '16:00',
        description: 'do not repeat',
        is_repeat: false,
        repetition: 'W',
        ends: '2016-03-22',
    };

    beforeEach(inject((_$rootScope_, _$q_) => {

        $rootScope = _$rootScope_;
        $q = _$q_;

        state = jasmine.createSpyObj('state', ['go']);

        stateParams = {};

        mockToastr = jasmine.createSpyObj('mockToastr', ['success']);

        mockMoment = jasmine.createSpyObj('mockMoment', ['format', 'isBefore', 'isSame', 'toDate']);
        let moment = (date) => {
            return mockMoment;
        }

        mockEventsService = jasmine.createSpyObj('mockEventsService', ['getEvent', 'createEvent', 'updateEvent']);
        mockEventsService.getEvent.and.returnValue({ $promise: $q.when([newEvent]) });
        mockEventsService.createEvent.and.callFake((event) => {
            return $q.resolve(event);
        });
        mockEventsService.updateEvent.and.callFake((id, event) => {
            return $q.resolve(event);
        });

        controller = new EditEventCtrl(state, stateParams, mockToastr, moment, mockEventsService);

    }));

    describe('title', () => {
        describe('when editing an event', () => {
            it('should return "Edit Event"', () => {
                controller.editing = true;

                expect(controller.title).toBe("Edit Event");
            });
        });

        describe('when creating an event', () => {
            it('should return "Create Event"', () => {
                controller.editing = false;

                expect(controller.title).toBe("Create Event");
            });
        });
    });

    describe('openStartDatePopup', () => {
        it('should set startDatePopupOpened to true', () => {
            controller.openStartDatePopup();

            expect(controller.startDatePopupOpened).toBe(true);
        });
    });

    describe('openEndDatePopup', () => {
        it('should set endDatePopupOpened to true', () => {
            controller.openEndDatePopup();

            expect(controller.endDatePopupOpened).toBe(true);
        });
    });

    describe('openEndRepeatPopup', () => {
        it('should set endRepeatPopupOpened to true', () => {
            controller.openEndRepeatPopup();

            expect(controller.endRepeatPopupOpened).toBe(true);
        });
    });

    describe('saveChanges', () => {
        it('should set saveButtonClicked to true', () => {
            controller.saveChanges();

            expect(controller.saveButtonClicked).toBe(true);
        });

        describe('when event info is not valid', () => {
            it('should not create or update event', () => {
                controller.saveChanges();

                expect(mockEventsService.createEvent).not.toHaveBeenCalled();
                expect(mockEventsService.updateEvent).not.toHaveBeenCalled();
            });
        });

        describe('when event info is valid', () => {
            beforeEach(() => {
                controller.startDate = new Date('January 1, 2016, 12:00:00');
                controller.startTime = new Date('January 1, 2016, 12:00:00');            
                controller.endDate = new Date('January 1, 2016, 13:00:00');
                controller.endTime = new Date('January 1, 2016, 13:00:00');
                controller.repetitionEndDate = new Date('January 3, 2016, 12:00:00');
            });

            describe('and event does not repeat', () => {
                it('should set event repetition and end date to be blank', () => {
                    controller.event = nonRepeatingEvent;

                    controller.saveChanges();

                    expect(controller.event.repetition).toBe('');
                    expect(controller.event.ends).toBe('');
                });
            });

            describe('and creating event', () => {

                beforeEach(() => {
                    controller.event = newEvent;
                });

                it('should create event through EventService', () => {
                    controller.saveChanges();

                    expect(mockEventsService.createEvent).toHaveBeenCalledWith(newEvent);
                });

                describe('and creation successful', () => {
                    it('should give successful toastr message', () => {
                        controller.saveChanges();
                        $rootScope.$apply();

                        expect(mockToastr.success).toHaveBeenCalledWith('Event Created!');
                    });

                    it('should navigate to the events list', () => {
                        controller.saveChanges();
                        $rootScope.$apply();
                        
                        expect(state.go).toHaveBeenCalledWith('eventsList');
                    });
                });
            });

            describe('and updating event', () => {

                beforeEach(() => {
                    controller.editing = true;
                    controller.event = newEvent;
                });
                
                it('should update event through EventService', () => {
                    controller.saveChanges();

                    expect(mockEventsService.updateEvent).toHaveBeenCalledWith(newEvent.id, newEvent);
                });

                describe('and update successful', () => {
                    it('should give successful toastr message', () => {
                        controller.saveChanges();
                        $rootScope.$apply();
                        
                        expect(mockToastr.success).toHaveBeenCalledWith('Event Updated!');
                    });

                    it('should navigate to the events list', () => {
                        controller.saveChanges();
                        $rootScope.$apply();
                        
                        expect(state.go).toHaveBeenCalledWith('eventsList');
                    });
                });
            });
        });
    });
});
